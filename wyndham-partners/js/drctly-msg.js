let drctlyMsg = {

  init(appId) {
    window.orbConfig = {
      connectionOptions: {
        gridUrl: "https://grid.meya.ai",
        appId: appId,
        integrationId: "integration.orb",
      },
      theme: {
        "brandColor": "#000000",
        "botAvatarUrl": "https://pbs.twimg.com/profile_images/1115756007961939969/E3599I7D_400x400.png"
      },
      windowFunctions: true,
    };
    (function() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = "https://cdn.meya.ai/v2/orb.js";
      document.body.appendChild(script);
      var fontStyleSheet = document.createElement("link");
      fontStyleSheet.rel = "stylesheet";
      fontStyleSheet.href = "https://cdn.meya.ai/font/inter.css";
      document.body.appendChild(fontStyleSheet);
    })();
  },
  launchChat() {

  },
  liveAgentReroute(chatConfig) {
    Object.keys(chatConfig.questionDetail).forEach(function(key) {
      //console.table('Key : ' + key + ', Value : ' + chatConfig.questionDetail[key]);
      liveagent.addCustomDetail(key,`${chatConfig.questionDetail[key]}`);
      let laEndpointUrl = `${chatConfig.liveAgentConfig.endpoint}?language=${chatConfig.liveAgentConfig.language}&org_id=${chatConfig.liveAgentConfig.orgId}&deployment_id=${chatConfig.liveAgentConfig.deploymentId}&button_id=${chatConfig.liveAgentConfig.chatBtnId}`;
      let laChatUrl = `${chatConfig.liveAgentConfig.url}?endpoint=${encodeURIComponent(laEndpointUrl)}`;
      //console.log(`chatUrl: ${laChatUrl}`);
      window.open(laChatUrl, "liveAgent", "menubar=no,resizable=yes,scrollbars=yes");
    })

  }

}
