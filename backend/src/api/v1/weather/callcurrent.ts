import { Hono } from "hono";
import { config } from "dotenv";
import wretch from "wretch";
import { cors } from "hono/cors";

config(); // โหลดค่า .env

const app = new Hono();
app.use('*', cors({ origin: 'https://weather-app.tony219y.com' }));

app.get("/test", async (c) => {
  const province = c.req.query("province") || '';
  const amphoe = c.req.query("district") || '';
  console.log(province, amphoe);
  const token = process.env.API_KEY;
  const today = new Date();
  const date = today.toISOString().split('T')[0]; // วันที่ในรูปแบบ YYYY-MM-DD
  const hour = today.getHours(); // ชั่วโมงในรูปแบบ 0-23
  console.log(token)

  const url2 = `https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly/place?province=${encodeURIComponent(province)}&amphoe=${encodeURIComponent(amphoe)}&fields=tc,rh&date=${date}&hour=${hour}&duration=2`; //current time
  // const url = `https://data.tmd.go.th/nwpapi/v1/forecast/location/daily/place?province=${encodeURIComponent(province)}&amphoe=${encodeURIComponent(amphoe)}&fields=tc,rh&date=${date}&duration=2`;

  try {
    const response = await wretch(url2)
      .headers({
        "accept": "application/json",
        "authorization": `Bearer ${token}`,
      })
      .get()
      .json<any>();
    console.log(response);
    return c.json(response as any);
  } catch (error) {
    return c.json({ error: "ไม่สามารถดึงข้อมูลสภาพอากาศได้" }, 500);
  }
});

export default app;
