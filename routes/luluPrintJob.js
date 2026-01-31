import express from "express";
import {createLuluPrintJob} from "../services/luluPrint.service"

import route from express.Router();

route.post("/" , createLuluPrintJob)