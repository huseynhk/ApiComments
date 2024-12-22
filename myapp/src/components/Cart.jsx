import React, { useEffect, useState } from "react";
import { GetDatas } from "../api/getRequest";
import { toast } from "react-toastify";
import { SlLike, SlDislike } from "react-icons/sl";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState({});

  const handleData = async () => {
    try {
      const response = await GetDatas();
      setData(response.comments);

      const storedVotes = JSON.parse(localStorage.getItem("votes")) || {};
      const initialVotes = response.comments.reduce((acc, comment) => {
        acc[comment.id] = storedVotes[comment.id] || { like: 0, dislike: 0 };
        return acc;
      }, {});
      setVotes(initialVotes);
    } catch (error) {
      toast.error("Failed to load comments!", {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  const getUpdatedVotes = (currentVotes, type) => {
    if (type === "like") {
      const newLike = currentVotes.like === 1 ? 0 : 1;
      return {
        like: newLike,
        dislike: newLike === 1 ? 0 : currentVotes.dislike,
      };
    }
    if (type === "dislike") {
      const newDislike = currentVotes.dislike === 1 ? 0 : 1;
      return {
        like: newDislike === 1 ? 0 : currentVotes.like,
        dislike: newDislike,
      };
    }
    return currentVotes;
  };

  const handleVote = (id, type) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [id]: getUpdatedVotes(prevVotes[id], type),
    }));
  };

  useEffect(() => {
    if (Object.keys(votes).length > 0) {
      localStorage.setItem("votes", JSON.stringify(votes));
    }
  }, [votes]);

  useEffect(() => {
    handleData();
  }, []);

  return (
    <div className="py-4 px-8 md:px-32 rounded-md">
      <h2 className="text-center mb-5 text-4xl font-bold text-blue-400">
        Comments
      </h2>
      <div className="space-y-4">
        {loading ? (
          <div className="mt-44 flex items-center justify-start">
            <h1 className="text-cyan-300 text-5xl mx-auto"> Loading...</h1>
          </div>
        ) : (
          data.map((comment) => (
            <div
              key={comment.id}
              className="border-2 border-cyan-200 py-4 px-8 rounded-md shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-medium text-cyan-300">
                  {comment.body}
                </p>
                <p className="text-md text-gray-300">
                  By: {comment.user.fullName}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleVote(comment.id, "like")}
                  className={`flex items-center space-x-1 ${
                    votes[comment.id]?.like === 1
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  <SlLike className="text-4xl" />
                  <span>{votes[comment.id]?.like}</span>
                </button>
                <button
                  onClick={() => handleVote(comment.id, "dislike")}
                  className={`flex items-center space-x-1 ${
                    votes[comment.id]?.dislike === 1
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  <SlDislike className="text-4xl" />
                  <span>{votes[comment.id]?.dislike}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cart;
