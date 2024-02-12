const Router = require("express").Router();
const businessService = require("../Services/business.service");
const JWT = require("jsonwebtoken");
const tokenKey = process.env.tokenKey;
let createBusiness = async (req, res) => {
  let { businessName, createdDate, userID } = "";
  try {
    let result = await businessService.createBusiness(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
let getBusiness = async (req, res) => {
  let { userID } = req.body;
  try {
    let result = await businessService.getBusiness(userID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
let deleteBusiness = async (req, res) => {
  try {
    let result = await businessService.deleteBusiness(req.body);
    console.log("result", result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
let updateBusinessName = async (req, res) => {
  let { token, businessname, targetBusinessId } = req.body;
  console.log("  req.body", req.body);
  try {
    let decoded = JWT.verify(token, tokenKey);
    let userID = decoded.userID;
    let result = await businessService.updateBusinessName(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
let removeEmployeersBusinessController = async (req, res) => {
  try {
    let result = await businessService.removeEmployeersBusiness(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  removeEmployeersBusinessController,
  createBusiness,
  getBusiness,
  deleteBusiness,
  updateBusinessName,
};
