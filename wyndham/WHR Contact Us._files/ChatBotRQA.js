let drctlyMsg = {

    init: function (appId) {
        this.appId = appId;
        window.orbConfig = {
            connectionOptions: {
                connect: false,
                gridUrl: "https://grid.meya.ai",
                appId: appId,
                integrationId: "integration.orb",
                pageContext: {
                    "logged_in": window.location.href.indexOf('/login') == -1
                }
            },
            theme: {
                "brandColor": "#003866",
                 "botAvatarUrl": "https://wyndham-chat.mw-directly.com/images/wyndham-avatar.jpeg"
            },
            windowApi: true
        };
        (function () {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src = "https://cdn.meya.ai/v2/orb.js";
            document.body.appendChild(script);
            var fontStyleSheet = document.createElement("link");
            fontStyleSheet.rel = "stylesheet";
            fontStyleSheet.href = "https://cdn.meya.ai/font/inter.css";
            document.body.appendChild(fontStyleSheet);
            var wyndhamStyleOverride = document.createElement("link");
            wyndhamStyleOverride.rel = "stylesheet";
            wyndhamStyleOverride.href = "https://wyndham-chat.mw-directly.com/css/drctly-msg.css";
            document.body.appendChild(wyndhamStyleOverride);
        })();
    },
    launchChat: function () {

    },
    liveAgentReroute: function (chatConfig) {
        let queryParams = "";
        Object.keys(chatConfig.questionDetail).forEach(function (key) {
            //console.table('Key : ' + key + ', Value : ' + chatConfig.questionDetail[key]);
            let value = chatConfig.questionDetail[key];
            sessionStorage.setItem(key, "" + value);
            if (typeof (liveagent) == "object") {
                liveagent.addCustomDetail(key, "" + value);
            }
            queryParams += "&" + key + "=" + encodeURIComponent(value);
        });
        sessionStorage.setItem("rerouteStatus", "ready");
        let laEndpointUrl = chatConfig.liveAgentConfig.endpoint + "?language=" + chatConfig.liveAgentConfig.language + "#deployment_id=" + chatConfig.liveAgentConfig.deploymentId + "&org_id=" + chatConfig.liveAgentConfig.orgId + "&button_id=" + chatConfig.liveAgentConfig.chatBtnId;
        let laChatUrl = chatConfig.liveAgentConfig.url + "?endpoint=" + encodeURIComponent(laEndpointUrl) + "&entry=expertReroute" + queryParams;
        console.log("chatUrl: " + laChatUrl);
        window.open(laChatUrl, "liveAgent", "menubar=no,resizable=yes,scrollbars=yes");
    },

    sessionKey: function () {
        return '/meya/' + this.appId + '/sessionStarted';
    },

    startSession: function () {
        localStorage.setItem(this.sessionKey(), true);
    },

    endSession: function () {
        localStorage.setItem(this.sessionKey(), false);
    },

    isSessionStarted: function () {
        return localStorage.getItem(this.sessionKey()) || false;
    },

    openChat: function () {
    
        if (this.isSessionStarted()) {
            this.showResetChatDialog();
        } else {
            this.doOpenChat();
        }
    },

    newChat: function () {
        orb.closeChat();
        localStorage.removeItem("https://grid.meya.ai/gateway/v2/orb/" + this.appId + "/integration.orb.orbUserId");
        localStorage.removeItem("https://grid.meya.ai/gateway/v2/orb/" + this.appId + "/integration.orb.orbThreadId");

        var chatMount = document.getElementsByClassName('orb-chat-mount')[0];
        if (chatMount) {
            chatMount.parentNode.removeChild(chatMount);
        }

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = "https://cdn.meya.ai/v2/orb.js";

        var self = this;
        script.onload = function () {
            self.doOpenChat();
        };
        document.body.appendChild(script);
    },

    doOpenChat: function () {
        orb.openChat();
        var closeIconInterval = window.setInterval(function () {
            if ($(".CloseIcon-sc-lrlgqw").length > 0) {
                clearInterval(closeIconInterval);
                setTimeout(function () {
                    if ($(".CloseIcon-sc-lrlgqw").children().length == 0) {
                        $(".CloseIcon-sc-lrlgqw").replaceWith("<svg class=\"IconRoot-sc-zpyqi6 iiWfrW CloseIcon-sc-lrlgqw ftBvyx\" viewBox=\"0 0 24 24\" style=\"display: none;\"><defs><style>.a{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><line class=\"a\" x1=\"4.5\" y1=\"19.5\" x2=\"19.5\" y2=\"4.5\"></line><line class=\"a\" x1=\"4.5\" y1=\"4.5\" x2=\"19.5\" y2=\"19.5\"></line></svg\">");
                        $(".CloseIcon-sc-lrlgqw").fadeIn();
                    }
                }, 1000);
            }
        }, 1000);

        this.startSession();
    },

    showResetChatDialog: function () {
        $('#meyaChatModal').modal('show');
    },


}
drctlyMsg.init("app-3f1a9cf59a514971a20e1c3f7fb59e54");
//development - app-30e1c58e409e41b582c2f01baf8fbb78
//sandbox - app-3f1a9cf59a514971a20e1c3f7fb59e54
//prod - app-3291cdd7b0324a248ee0abeeefe2f2ca

window.orbOpenChat = function () {
    drctlyMsg.openChat();
}

$(document).ready(function () {
    $('body').append('<!-- <!-- Modal --><div class="modal" id="meyaChatModal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="myModalLabel">Continue current chat or ask new question?</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-footer"><button type="button" class="btn btn-chatButtonpopup" data-dismiss="modal" id="meyaChatContinue">Continue chat</button><button type="button" id="meyaChatNew" class="btn btn-chatButtonpopup">New question</button></div></div></div></div>');

    $('#meyaChatContinue').click(function () {
        drctlyMsg.doOpenChat();
        $('#meyaChatModal').modal('show');
    });

    $('#meyaChatNew').click(function () {
        drctlyMsg.newChat();
        $('#meyaChatModal').modal('hide');
    });

    $("<style type='text/css'> .OrbAvatarRoot-sc-xiy62c { visibility: hidden; } .TextBaseRoot-sc-4wcnzg { max-width: 100%; } </style>").appendTo("head");
});