"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gfsBucket = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const report_router_1 = __importDefault(require("./routes/report.router"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const MONGO_URL = process.env.DATABASE_URL || 'mongodb://localhost/gemastik-ui-backend';
// Set up MongoDB connection options
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 2 * 60 * 60 * 1000, // 2 hours for server selection timeout
    connectTimeoutMS: 2 * 60 * 60 * 1000, // 2 hours for connection timeout
    bufferCommands: false, // Disable Mongoose buffering
};
// Connect to MongoDB using mongoose.connect
mongoose_1.default.connect(MONGO_URL, mongooseOptions)
    .then(() => {
    console.log('MongoDB connected');
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process on MongoDB connection error
});
const conn = mongoose_1.default.connection; // Get default mongoose connection
conn.once('open', () => {
    exports.gfsBucket = new mongoose_1.default.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads' // Replace with your bucket name
    });
});
// Middleware for parsing JSON bodies
app.use(express_1.default.json({ limit: '100mb' }));
// Middleware body-parser untuk parsing application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Other middleware
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
// Routes
app.use('/auth', auth_router_1.default);
app.use('/reports', report_router_1.default);
// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
