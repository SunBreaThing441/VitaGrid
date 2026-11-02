import {
  getUserById,
  updatePersonalInformationFetch,
  getOrderByUser,
  updatePassword,
} from "./FetchApi";
import { logout as unifiedLogout } from "../auth/fetchApi";

export const logout = unifiedLogout;

export const fetchData = async (dispatch) => {
  dispatch({ type: "loading", payload: true });
  let userId = "";
  try {
    const rawJwt = localStorage.getItem("jwt");
    if (rawJwt) {
      userId = JSON.parse(rawJwt)?.user?._id || "";
    }
  } catch (e) {}

  try {
    let responseData = await getUserById(userId);
    setTimeout(() => {
      if (responseData && responseData.User) {
        dispatch({ type: "userDetails", payload: responseData.User });
        dispatch({ type: "loading", payload: false });
      }
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

export const fetchOrderByUser = async (dispatch) => {
  dispatch({ type: "loading", payload: true });
  let userId = "";
  try {
    const rawJwt = localStorage.getItem("jwt");
    if (rawJwt) {
      userId = JSON.parse(rawJwt)?.user?._id || "";
    }
  } catch (e) {}

  try {
    let responseData = await getOrderByUser(userId);
    setTimeout(() => {
      if (responseData && responseData.Order) {
        dispatch({ type: "OrderByUser", payload: responseData.Order });
        dispatch({ type: "loading", payload: false });
      }
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

export const updatePersonalInformationAction = async (dispatch, fData) => {
  const formData = {
    uId: fData.id,
    name: fData.name,
    phoneNumber: fData.phone,
  };
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await updatePersonalInformationFetch(formData);
    setTimeout(() => {
      if (responseData && responseData.success) {
        dispatch({ type: "loading", payload: false });
        fetchData(dispatch);
      }
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

export const handleChangePassword = async (fData, setFdata, dispatch) => {
  if (!fData.newPassword || !fData.oldPassword || !fData.confirmPassword) {
    setFdata({
      ...fData,
      error: "Please provide your all password and a new password",
    });
  } else if (fData.newPassword !== fData.confirmPassword) {
    setFdata({ ...fData, error: "Password does't match" });
  } else {
    let uId = "";
    try {
      const rawJwt = localStorage.getItem("jwt");
      if (rawJwt) {
        uId = JSON.parse(rawJwt)?.user?._id || "";
      }
    } catch (e) {}

    const formData = {
      uId,
      oldPassword: fData.oldPassword,
      newPassword: fData.newPassword,
    };
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await updatePassword(formData);
      if (responseData && responseData.success) {
        setFdata({
          ...fData,
          success: responseData.success,
          error: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        dispatch({ type: "loading", payload: false });
      } else if (responseData.error) {
        dispatch({ type: "loading", payload: false });
        setFdata({
          ...fData,
          error: responseData.error,
          success: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
