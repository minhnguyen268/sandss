'use client'

import { Box, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AccountBalance from "../user/AccountBalance";
import { useEffect, useState } from "react";
import SettingService from "@/services/admin/SettingService";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { setCloseDialog, setLogo, setNoiDungPopup } from "@/redux/actions/setting";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

const Languages = [
  {
    lng: "vi",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1599px-Flag_of_Vietnam.svg.png"
  },
  {
    lng: "en",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/600px-Flag_of_the_United_Kingdom_%281-2%29.svg.png"
  },
  // {
  //   lng: "ko",
  //   image: "https://media.istockphoto.com/id/1132287785/vi/vec-to/qu%E1%BB%91c-k%E1%BB%B3-h%C3%A0n-qu%E1%BB%91c.jpg?s=612x612&w=0&k=20&c=CuJo8BowAbKtQ_plZgyqRW6QD6RjatHSf25X4pGeULg="
  // },
]

const Header = () => {
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();
  const { isDialogOpen, logoUrl, noiDungPopup } = useSelector((state) => state.setting);
  const [isOpenSwitchLanguage, setIsOpenSwitchLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("vi");
  const [scriptChat, setScriptChat] = useState();

  const dispatch = useDispatch();

  const getData = async () => {
    const res = await SettingService.get();
    dispatch(setLogo(res.data.data?.logo));
    dispatch(setNoiDungPopup(res.data.data?.noiDungPopup));
    setScriptChat(res.data.data?.scriptChat);
  };

  useEffect(() => {
    const lng = localStorage?.getItem('i18nextLng') ?? "vi";
    setSelectedLanguage(lng);
  }, []);

  const handleClose = () => {
    dispatch(setCloseDialog());
  };

  useEffect(() => {
    getData();
  }, []);

  const Language = ({lng, image}) => {
    const { i18n } = useTranslation();
    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
      setSelectedLanguage(lng);
      setIsOpenSwitchLanguage(false);
    };
    return (
      <div>
        <img
          src={image}
          style={{
            width: "28px",
            height: "19px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => changeLanguage(lng)}
        />
      </div>
    );
  }

  const selectedLanguageImage = Languages.find(l => l.lng === selectedLanguage)?.image;

  const transformNoiDungPopup = (noiDungPopup) => {
    let result = noiDungPopup;
    result = result.replaceAll("Chào mừng bạn đến với SANDS &nbsp;nhân dịp SANDS ra mắt tròn 13 tuổi, chúng tôi triển khai trương trình khuyến mãi đặc biệt:", t("Chào mừng bạn đến với SANDS &nbsp;nhân dịp SANDS ra mắt tròn 13 tuổi, chúng tôi triển khai trương trình khuyến mãi đặc biệt:"));
    result = result.replaceAll("Nạp trên", t("Nạp trên"));
    result = result.replaceAll("khuyến mãi ngay", t("khuyến mãi ngay"));
    return result;
  }

  const [liveChatLoaded, setLiveChatLoaded] = useState(false);

  useEffect(() => {
    if (!liveChatLoaded && typeof window !== 'undefined' && document && scriptChat) {

      const executeScript = new Function(scriptChat);
      executeScript();

      setLiveChatLoaded(true);
    }
  }, [liveChatLoaded, scriptChat]);

  return (
    <>
      {noiDungPopup && (
        <Dialog PaperProps={{ sx: { borderRadius: "10px" } }} open={isDialogOpen} onClose={handleClose}>
          <DialogTitle style={{ color: "white", backgroundColor: "red", textAlign: "center" }}>
            {t('SystemNotification')}
          </DialogTitle>
          <DialogContent style={{ width: "100%", maxWidth: "450px" }}>
            <div style={{ fontSize: "13px" }} dangerouslySetInnerHTML={{ __html: transformNoiDungPopup(noiDungPopup) }}></div>
          </DialogContent>
          <DialogActions style={{ display: "flex", justifyContent: "center", paddingBottom: "20px" }}>
            <button
              onClick={handleClose}
              style={{
                color: "white",
                backgroundColor: "red",
                fontSize: "20px",
                borderRadius: "10px",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              {t('Close')}
            </button>
          </DialogActions>
        </Dialog>
      )}
      <div className="header" style={{ paddingTop: 10 }}>
        <div className="header-top">
          <Link href="/">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <img
                src={logoUrl ?? "https://store-images.s-microsoft.com/image/apps.57673.14334732404981543.8ee705ad-da86-43ad-a676-5167a879f939.e5cafa8c-2a95-4252-a86b-bdaaa051cce8"}
                alt="logo"
                style={{ height: "50px", borderRadius: 5 }}
                loading="eager"
              />
            </Box>
          </Link>
          <Box
            className="header-right"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {status === "unauthenticated" && (
              <>
                <Link href="/login">
                  <Button
                    className="btn-login"
                    sx={{
                      background: "linear-gradient(124.32deg, #ffce1f 12.08%, #ccd26d 85.02%)",
                    }}
                  >
                    {t('Login')}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="btn-register"
                    sx={{
                      background: "linear-gradient(124.32deg, #50a1f2 12.08%, #85daff 85.02%)",
                    }}
                  >
                    {t('Register')}
                  </Button>
                </Link>
              </>
            )}
            {status === "authenticated" && <AccountBalance />}
            <img src={selectedLanguageImage}
              style={{
                width: "28px",
                height: "19px",
                borderRadius: "5px",
                cursor: "pointer",
                marginLeft: status === "authenticated" ? "10px" : "0"
              }}
              onClick={() => setIsOpenSwitchLanguage(!isOpenSwitchLanguage)}
            />
            {isOpenSwitchLanguage && <div style={{ position: 'absolute', right: '-8px', top: '45px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px', backgroundColor: 'rgb(23 46 94)', borderRadius: '4px' }}>
              {Languages.map(l => (
                <Language lng={l.lng} image={l.image} />
              ))}
            </div>}
          </Box>
        </div>
      </div>
    </>
  );
};
export default Header;
