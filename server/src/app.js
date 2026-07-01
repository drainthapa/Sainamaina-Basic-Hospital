const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");

const apiRoutes = require("./routes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { UPLOAD_DIR } = require("./utils/storage");
const logger = require("./utils/logger");

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow <img>/<a> to load uploaded files from client origin
  }),
);

// CORS - restrict to the configured client origin(s), with credentials for the refresh-token cookie.
// CLIENT_URL can be a single origin or a comma-separated list (e.g. for running the admin panel
// and public site dev servers side by side on different Vite ports).
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, server-to-server) and any configured origin.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  }),
);

app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }),
);

// Rate limiting — protect against brute force and credential stuffing in production.
// Skip entirely for loopback requests in development (both client apps run on localhost
// and make automated background calls like /refresh, which would trivially exhaust a
// shared per-IP limit during normal dev usage).
const isDev = process.env.NODE_ENV !== "production";

const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || (isDev ? 2000 : 300),
  standardHeaders: true,
  legacyHeaders: false,
  skip: isDev
    ? (req) => {
        const ip = req.ip || "";
        return (
          ip === "127.0.0.1" || ip === "::1" || ip.startsWith("::ffff:127.")
        );
      }
    : undefined,
});

// The /refresh endpoint is called automatically by the client on every page load to
// silently renew the session. Even in production it doesn't benefit from strict rate
// limiting since it requires a valid signed httpOnly cookie — so give it a very
// generous limit separate from the global one.
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/refresh", refreshLimiter);
app.use("/api", globalLimiter);

// Static file serving for locally-stored uploads (downloads, photos, doctor headshots, etc.)
app.use("/uploads", express.static(UPLOAD_DIR));

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
