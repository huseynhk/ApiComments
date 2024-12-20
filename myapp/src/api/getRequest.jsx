import axios from "axios";

export const GetDatas = async () => {
  try {
    const response = await axios.get('https://dummyjson.com/comments');
    if (response.status !== 200) {
      throw new Error("Error");
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error.message);
  }
};
