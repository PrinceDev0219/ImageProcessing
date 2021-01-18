import Axios from "./instance";

export const loginApi = (email, password) => {
  return new Promise((resolve, reject) => {
    Axios.post("/auth/signin", { email: email, password: password })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject({ status: "error" });
      });
  });
};

export const signUpApi = (
  firstName,
  lastName,
  email,
  password,
  phoneNumber
) => {
  return new Promise((resolve, reject) => {
    Axios.post("/auth/signup", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
    })
      .then((res) => {
        console.log(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        reject({ status: "error" });
      });
  });
};

export const forgotPasswordApi = (email) => {
  console.log(email);
  return new Promise((resolve, reject) => {
    Axios.get("/auth/forgotPassword", { params: { email: email } })
      .then((res) => {
        console.log(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        reject({ status: "error" });
      });
  });
};

export const resetPasswordApi = (verifyCode, email, userPassword) => {
  return new Promise((resolve, reject) => {
    Axios.post("/auth/resetPassword", {
      code: verifyCode,
      email: email,
      password: userPassword,
    })
      .then((res) => {
        console.log(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        reject({ status: "error" });
      });
  });
};

export const getFiles = (user_id, file_name, index_page, per_page) => {
  return new Promise((resolve, reject) => {
    Axios.post("/files", {
      user_id: user_id,
      file_name: file_name,
      index_page: index_page,
      per_page: per_page,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject({ data: [], count: 0 });
      });
  });
};

export const imageUpload = (fileData) => {
  console.log("hello---", fileData);
  return new Promise((resolve, reject) => {
    Axios.post("/upload", fileData, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(
          "image---responsive----------===========>>>>>>>>>>>" + res.data.filepath
        );
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
				console.log("stress")
        reject({ data: [], count: 0 });
      })
			.finally(() => {
			});
  });
};

export const updateProfile = (data) => {
  return new Promise((resolve, reject) => {
    Axios.post("/user/update", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject("error");
      });
  });
};

export const getProfile = (id) => {
  return new Promise((resolve, reject) => {
    Axios.get("/user/detail/" + id)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject([]);
      });
  });
};

export const scan = (data) => {
  return new Promise((resolve, reject) => {
    Axios.post("/scan", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const payment = (data) => {
  return new Promise((resolve, reject) => {
    Axios.post("/payment", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const memberShipSave = (data) => {
  return new Promise((resolve, reject) => {
    Axios.post("/payment/membership", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
