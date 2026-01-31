import axios from "axios";
import { getLuluToken } from "./lulu.service.js";

export const createLuluPrintJob = async ({
  interiorPdfUrl,
  coverPdfUrl,
  shippingAddress,
  title,
  pageCount
}) => {
  const token = await getLuluToken();

  console.log("token",token)

  const payload = {
    contact_email: "noyefe8703@juhxs.com",

    shipping_level: "MAIL",

    shipping_address: {
      name: shippingAddress.name,
      street1: shippingAddress.address1,
      city: shippingAddress.city,
      country_code: "US", // must be ISO-2
      postcode: shippingAddress.postalCode
    },

    line_items: [
      {
        quantity: 1,
        title,
        page_count: pageCount,

        pod_package_id: "0600X0900BWSTDPB060UW444MXX",

        printable_normalization: {
          interior: {
            source_url: interiorPdfUrl
          },
          cover: {
            source_url: coverPdfUrl,
            finish: "MATTE"
          }
        }
      }
    ]
  };

  console.log("payload",payload)

  try {
    const res = await axios.post(
      "https://api.sandbox.lulu.com/print-jobs/",
      
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("res lulu" , res)

    return {
      luluJobId: res.data.id,
      status: res.data.status
    };

  } catch (err) {
    console.error(
      "❌ Lulu print job failed:",
      err.response?.data || err.message
    );
    throw err;
  }
};
