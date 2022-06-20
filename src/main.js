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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require('dotenv').config();
var telegraf_1 = require("telegraf");
var RealCurrencyExchangeRate_1 = require("./RealCurrencyExchangeRate");
var BOT_TOKEN = process.env.BOT_TOKEN || '';
var bot = new telegraf_1.Telegraf(BOT_TOKEN);
bot.start(function (ctx) {
    var message = "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u0443 /rate \u0438 \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u0430\u0440\u0443 \u0432\u0430\u043B\u044E\u0442 \u0434\u043B\u044F \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u0432\u044B \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0437\u043D\u0430\u0442\u044C \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u0443\u0440\u0441, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 /rate RUBEUR";
    ctx.reply(message);
});
bot.command('rate', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var text, currenciesSymbols, exchange, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                text = ctx.update.message.text;
                currenciesSymbols = text.replace('/rate ', '');
                exchange = new RealCurrencyExchangeRate_1.RealCurrencyExchangeRate(currenciesSymbols);
                return [4 /*yield*/, exchange.get()];
            case 1:
                result = _a.sent();
                ctx.replyWithHTML("\n\u041F\u043E \u0434\u0430\u043D\u043D\u044B\u043C \u043D\u0430 ".concat(result.time, " MSK \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C ").concat(result.currency, ":\n\n<strong>").concat(result.rate, " ").concat(result.symbol, "</strong>\n\n\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u043C\u0435\u0442\u043E\u0434\u044B \u043E\u0431\u043C\u0435\u043D\u0430: ").concat(result.methods, "\n\n\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A: <a href=\"https://p2p.binance.com/en/trade/all-payments/USDT?fiat=").concat(result.fiat, "\">Binance</a>\n    "), { disable_web_page_preview: true });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                ctx.reply('Укажите пару валют, например RUBEUR');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.launch();
