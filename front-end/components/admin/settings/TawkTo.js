import OutlinedInput from "@/components/input/OutlinedInput";
import useGetTawkToConfig from "@/hooks/admin/useGetTawkToConfig";
import SystemService from "@/services/admin/SystemService";
import { Backdrop, Box, Button, CircularProgress, FormControl, Typography, TextareaAutosize } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SocketContext from "../../../context/socket";
import BreadcrumbBar from "../BreadcrumbBar";
import SettingService from "@/services/admin/SettingService";

const BreadcrumbsData = [
  {
    title: "Admin",
    href: "/admin",
  },
  {
    title: "Settings",
    href: "/admin/settings",
  },
  {
    title: "Cấu hình Live chat Tawk To",
    href: "/admin/settings/tawk-to",
  },
];
const TawkTo = () => {
  const { socket } = useContext(SocketContext);
  const { data: dataQuery, isLoading, refetch } = useGetTawkToConfig();

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [scriptChat, setScriptChat] = useState("");
  const [tawk, setTawk] = useState(
    dataQuery ?? {
      propertyId: "",
      widgetId: "",
    }
  );

  const getSetting = async () => {
    const res = await SettingService.get();
    setScriptChat(res.data.data?.scriptChat);
  };

  useEffect(() => {
    if (dataQuery) {
      setTawk(dataQuery);
    }

    getSetting();
  }, [dataQuery]);

  const handleClickChange = async () => {
    try {
      setIsLoadingState(true);

      const res = await SystemService.updateTawkToConfig({
        tawkToConfigs: tawk,
      });
      await SettingService.update(undefined, undefined, undefined, scriptChat);
      refetch();
      toast.success(res?.data?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Thông tin cấu hình không hợp lệ");
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleChangeLiveChat = async () => {
    try {
      setIsLoadingState(true);
      await SettingService.update(undefined, undefined, undefined, scriptChat);
      toast.success("Update script live chat success");
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleChangeInput = (e) => {
    setTawk((state) => ({ ...state, [e.target.name]: e.target.value }));
  };
  return (
    <>
      <BreadcrumbBar data={BreadcrumbsData} />
      <h1
        className="title admin"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Cài đặt Tawk.to
      </h1>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          maxWidth: "60rem",
          gap: "1rem",
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        {isLoadingState && (
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoadingState}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        {isLoading && <CircularProgress color="inherit" />}
        {!isLoading && dataQuery && (
          <>
            <Typography>
              Hướng dẫn: Truy cập{" "}
              <a href="https://help.tawk.to/article/react-js" target="_blank">
                https://help.tawk.to/article/react-js
              </a>{" "}
              để biết cách lấy PropertyID và Widget ID
            </Typography>
            <FormControl fullWidth>
              <Typography>Property ID</Typography>

              <OutlinedInput
                placeholder="Property ID"
                size="small"
                type="text"
                name="propertyId"
                fullWidth
                value={tawk.propertyId}
                onChange={handleChangeInput}
              />
            </FormControl>
            <FormControl fullWidth>
              <Typography>Widget ID</Typography>

              <OutlinedInput
                placeholder="Widget ID"
                size="small"
                type="text"
                fullWidth
                value={tawk.widgetId}
                name="widgetId"
                onChange={handleChangeInput}
              />
            </FormControl>

            <Button onClick={handleClickChange}>Lưu thay đổi</Button>
          </>
        )}
      </Box>
      <h1
        className="title admin"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Cài đặt Live chat
      </h1>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          maxWidth: "60rem",
          gap: "1rem",
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        <Typography>Script chat</Typography>

        <TextareaAutosize
          placeholder="Script chat"
          size="small"
          type="text"
          fullWidth
          minRows={5}
          maxRows={15}
          style={{ width: "100%", borderRadius: "10px", padding: "5px 10px" }}
          value={scriptChat}
          name="scriptChat"
          onChange={(e) => setScriptChat(e.target.value)}
        />
      </Box>

      <Button onClick={handleChangeLiveChat}>Lưu thay đổi</Button>
    </>
  );
};
export default TawkTo;
