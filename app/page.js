"use client";
import React, { useState, useEffect } from "react";
import { apiConstants, paramConstants, viewConstants } from "./constants";
import "./globals.css";

export default function UserDetail() {
  const [formSuccess, setFormSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState({});
  const [userGender, setUserGender] = useState({});
  const [userCountry, setUserCountry] = useState([]);
  const [userCountryCode, setUserCountryCode] = useState("");

  // setting input values
  const handleInput = (e) => {
    // const fieldName = e.target.name;
    // const fieldValue = e.target.value;
    setUserName(e.target.value);
  };

  // Fetching detail from server urls
  const getDetailsFromApi = (apiUrl, setUserState) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const serverUrl = `${apiUrl}?${paramConstants.name}=${userName}`;
    fetch(serverUrl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUserState(result);
      })
      .catch((error) => console.error(error));
  };

  const submitForm = async (e) => {
    // We don't want the page to refresh
    e.preventDefault();
    setIsLoading(true);
    try {
      await getDetailsFromApi(apiConstants.ageApi, setUserAge);
      await getDetailsFromApi(apiConstants.genderApi, setUserGender);
      await getDetailsFromApi(apiConstants.nationApi, setUserCountry);
    } catch (error) {
      // Handle error if necessary
      console.error(error);
      setFormSuccess(false);
      setIsLoading(false);
    } finally {
      setFormSuccess(true);
      setIsLoading(false); // Set loading to false when the request completes
    }
  };

  // To get the user country based on highest probability in country array
  const getUserCountry = () => {
    // sorting the country array based on probability in descending order
    userCountry?.country?.sort(function (a, b) {
      return b.probability - a.probability;
    });
    setUserCountryCode(userCountry?.country?.[0]?.country_id);
  };

  // Reset the form details
  const resetDetails = () => {
    setFormSuccess(false);
    setUserName("");
  };

  useEffect(() => {
    getUserCountry();
  }, [userCountry]);
  // Left & Right View section of User Details
  const renderDetailSection = (data) => (
    <div className="detailSection">
      <text className="textColor">{data}</text>
    </div>
  );

  // User Detail View
  const renderUserDetail = (key, value) => (
    <div>
      {renderDetailSection(key)}
      <div className="colonSeparator">
        <text className="colonText">:</text>
      </div>
      {renderDetailSection(value)}
    </div>
  );

  // Detail View
  const renderDetailView = () => (
    <div className="userDetailsView">
      <h1 className="userDetailsText">{viewConstants.userDetails}</h1>
      <div className="userDetailsView">
        {renderUserDetail(viewConstants.userName, userName)}
        {renderUserDetail(viewConstants.userAge, userAge.age)}
        {renderUserDetail(viewConstants.userGender, userGender.gender)}
        {renderUserDetail(viewConstants.userCountry, userCountryCode)}
        <button className="resetButton" onClick={resetDetails} type="submit">
          {viewConstants.labelGetAnotherDetail}
        </button>
      </div>
    </div>
  );

  // Form View
  const renderUserForm = () => {
    {
      return isLoading ? (
        <p>{viewConstants.labelLoading}</p>
      ) : (
        <div>
          <h1 className="userFormText">{viewConstants.userForm}</h1>
          <div className="inputParamView">
            <label className="inputParamText">{viewConstants.labelName}</label>
            <input
              className="inputContainer"
              placeholder={paramConstants.enterName}
              type="text"
              name={paramConstants.name}
              onChange={handleInput}
              value={userName}
            />
          </div>
          <div className="submitButtonView">
            <button
              className={
                userName == "" ? "disabledSubmitButton" : "submitButton"
              }
              disabled={userName == ""}
              type="submit"
              onClick={submitForm}
            >
              {viewConstants.labelSubmit}
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <main>
      <h1 className="mainHeading">{viewConstants.welcome}</h1>
      <div>{formSuccess ? renderDetailView() : renderUserForm()}</div>
    </main>
  );
}
