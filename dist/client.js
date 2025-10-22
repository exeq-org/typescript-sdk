"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExeqClient = void 0;
const runtime_1 = require("./runtime");
const index_1 = require("./apis/index");
class ExeqClient {
    constructor(options) {
        const config = new runtime_1.Configuration({
            basePath: options.baseUrl || 'https://api.exeq.dev',
            apiKey: options.apiKey,
        });
        this.api = new index_1.ApikeyApi(config);
    }
    // Session Management
    createSession() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const request = {
                duration: options.duration,
                sessionRecordingEnabled: options.sessionRecordingEnabled,
                profileId: options.profileId,
                residentialProxyEnabled: options.residentialProxyEnabled,
                residentialProxyCountry: options.residentialProxyCountry,
                residentialProxyState: options.residentialProxyState,
                residentialProxyCity: options.residentialProxyCity,
            };
            const response = yield this.api.v1SessionsPost({
                internalServerPublicCreateSessionRequest: request,
            });
            return this.mapSession(response);
        });
    }
    getSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.v1SessionsIdGet({ id });
            return this.mapSession(response);
        });
    }
    listSessions() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            var _a;
            const response = yield this.api.v1SessionsGet({
                limit: options.limit,
                offset: options.offset,
            });
            return ((_a = response.sessions) === null || _a === void 0 ? void 0 : _a.map(session => this.mapSession(session))) || [];
        });
    }
    stopSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.api.v1SessionsIdDelete({ id });
        });
    }
    extendSession(id, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = { duration };
            const response = yield this.api.v1SessionsIdExtendPost({
                id,
                internalServerPublicExtendSessionRequest: request,
            });
            return this.mapSession(response);
        });
    }
    // Profile Management
    listProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield this.api.v1ProfilesGet();
            return ((_a = response.profiles) === null || _a === void 0 ? void 0 : _a.map(profile => this.mapProfile(profile))) || [];
        });
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.v1ProfilesIdGet({ id });
            return this.mapProfile(response);
        });
    }
    // Private mapping methods
    mapSession(session) {
        return {
            id: session.id,
            status: session.status,
            cdpUrl: session.cdpUrl,
            vncUrl: session.vncUrl,
            vncPassword: session.vncPassword,
            expiresAt: session.expiresAt || null,
            createdAt: session.createdAt,
            sessionRecordingEnabled: session.sessionRecordingEnabled,
            sessionRecordingUrl: session.sessionRecordingUrl || null,
            residentialProxyEnabled: session.residentialProxyEnabled,
        };
    }
    mapProfile(profile) {
        return {
            id: profile.id,
            name: profile.name,
            createdAt: profile.createdAt,
        };
    }
}
exports.ExeqClient = ExeqClient;
