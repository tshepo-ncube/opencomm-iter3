"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../_Components/sidebar";
import Header from "../../_Components/header";
import CommunityDB from "../../database/community/community";
import AdminCommunity from "../../_Components/AdminCommunities";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const CreateCommunity = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isUserPopupOpen, setUserPopupOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [category, setCategory] = useState("general");
  const [view, setView] = useState("Communities");
  const [userName, setUserName] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [roles, setRoles] = useState({ user: false, admin: false });
  const [url, setUrl] = useState("");

  // Image fields
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  //

  const popupRef = useRef(null);
  const userPopupRef = useRef(null);

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => setPopupOpen(false);

  const handleOpenUserPopup = () => setUserPopupOpen(true);
  const handleCloseUserPopup = () => setUserPopupOpen(false);

  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
    setRoles((prevRoles) => ({ ...prevRoles, [name]: checked }));
  };

  const handleFormSubmit = (e, status) => {
    e.preventDefault();

    if (!image) {
      alert("Please include an image");
      return;
    }

    // CommunityDB.uploadCommunityImage(image);

    //uploadCommunityImage;

    const communityData = {
      name,
      description,
      category,
      status,
    };

    //Need to add image to community data to then update th DB

    if (editIndex !== null) {
      CommunityDB.updateCommunity(
        { id: submittedData[editIndex].id, ...communityData },
        (updatedData) => {
          const updatedSubmittedData = [...submittedData];
          updatedSubmittedData[editIndex] = updatedData;
          setSubmittedData(updatedSubmittedData);
        },
        setLoading
      );
    } else {
      //   CommunityDB.createCommunity(
      //     communityData,
      //     (newCommunity) =>
      //       setSubmittedData((prevData) => [...prevData, newCommunity]),
      //     setLoading
      //   );

      CommunityDB.createCommunity(
        {
          name,
          description,
          category,
          status,
        },
        image,
        (newCommunity) =>
          setSubmittedData((prevData) => [...prevData, newCommunity]),
        setLoading
      );
    }

    setName("");
    setDescription("");
    setCategory("general");
    setImage(null); //image
    setEditIndex(null);
    setPopupOpen(false);
  };

  const handleEdit = (index) => {
    setName(submittedData[index].name);
    setDescription(submittedData[index].description);
    setCategory(submittedData[index].category);
    setImage(submittedData[index].image); //image
    setEditIndex(index);
    setPopupOpen(true);
  };

  useEffect(() => {
    CommunityDB.getAllCommunities((data) => {
      setSubmittedData(data);
      setLoading(false);
    }, setLoading);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
      if (
        userPopupRef.current &&
        !userPopupRef.current.contains(event.target)
      ) {
        setUserPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex-col items-center min-h-screen relative text-center">
      <Header />
      <div className="flex justify-center mt-8 mb-4">
        <span
          onClick={() => setView("Communities")}
          className={`cursor-pointer mx-4 text-lg ${
            view === "Communities" ? "font-bold text-black" : "text-gray-500"
          }`}
        >
          Community Management
        </span>
        <span
          onClick={() => setView("User Management")}
          className={`cursor-pointer mx-4 text-lg ${
            view === "User Management"
              ? "font-bold text-black"
              : "text-gray-500"
          }`}
        >
          User Management
        </span>
      </div>

      <div className="border-t border-openbox-green w-full my-4"></div>

      {view === "Communities" ? (
        <>
          <div className="flex justify-center mt-4 mb-8">
            <button
              onClick={handleOpenPopup}
              className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              + CREATE COMMUNITY
            </button>
          </div>

          {isPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md z-10"></div>
          )}

          {isPopupOpen && (
            <div
              ref={popupRef}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 h-auto max-h-full overflow-auto"
            >
              <h1 className="text-xl font-bold  text-gray-700 tracking-wide mb-4">
                Create a new community
              </h1>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-m text-gray-700 text-left font-semibold"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-m text-gray-700 text-left font-semibold"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  >
                    <option value="General">General</option>
                    <option value="Sports">Sports/Fitness</option>
                    <option value="Social">Social Activities</option>
                    <option value="Retreat">Company Retreat</option>
                    <option value="Development">
                      Professional Development
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-m text-gray-700 text-left font-semibold"
                  >
                    Community Description
                    {/* can we have a word limit for this */}
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>

                {image && (
                  <div>
                    <p>Image uploaded successfully!</p>
                    <img
                      src={image}
                      alt="Uploaded"
                      style={{ width: "300px" }}
                    />
                  </div>
                )}

                {/* Add Image here */}

                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="image"
                    className="block text-m text-gray-700 font-semibold"
                  >
                    Community Profile Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={handleUploadButtonClick}
                    className="p-2 bg-openbox-green hover:bg-hover-obgreen text-white rounded-md"
                  >
                    Choose Image
                  </button>
                  {image && (
                    <p className="mt-2 text-gray-600">Uploaded: {image.name}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => handleFormSubmit(e, "draft")}
                    className="btn bg-gray-500 hover:bg-gray-700 btn text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleFormSubmit(e, "active")}
                    className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    {editIndex !== null ? "Save" : "Create"}
                  </button>
                  <CloseIcon
                    className="absolute top-4 right-4 text-black-500 cursor-pointer"
                    onClick={handleClosePopup}
                  />
                </div>
              </form>
            </div>
          )}

          {submittedData.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-900 text-lg">
                You have created no communities yet.
              </p>
              <p className="text-gray-900 text-lg">
                Click on <span className="font-bold">create community</span> to
                get started.
              </p>
            </div>
          ) : (
            <AdminCommunity
              submittedData={submittedData}
              handleEdit={handleEdit}
            />
          )}
        </>
      ) : (
        <>
          <div className="flex justify-center mt-4 mb-8">
            <button
              onClick={handleOpenUserPopup}
              className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              + ADD A USER
            </button>
          </div>

          {isUserPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md z-10"></div>
          )}

          {isUserPopupOpen && (
            <div
              ref={userPopupRef}
              className="mt-16 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 h-3/4 sm:h-auto lg:h-auto"
            >
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="userSurname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="userSurname"
                    value={userSurname}
                    onChange={(e) => setUserSurname(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="userEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="userPhone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="userPhone"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="userRole"
                    name="user"
                    checked={roles.user}
                    onChange={handleRoleChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="userRole"
                    className="text-sm font-medium text-gray-700"
                  >
                    User
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="adminRole"
                    name="admin"
                    checked={roles.admin}
                    onChange={handleRoleChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="adminRole"
                    className="text-sm font-medium text-gray-700"
                  >
                    Admin
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    onClick={handleCloseUserPopup}
                    className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    Add User
                  </button>
                  <CloseIcon
                    className="absolute top-4 right-4 text-black-500 cursor-pointer"
                    onClick={handleCloseUserPopup}
                  />
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CreateCommunity;
