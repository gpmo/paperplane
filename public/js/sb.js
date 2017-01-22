var sb = new SendBird({"appId":"B27C3E56-E48A-4CC4-B788-10E163501C17"});
var channel;
var channelHandler;

joinChannel("mgmt-101");

function joinChannel(channel_name) {
  var username = $("#username").val();
  var currentChannel = $("#channel").val();
  // check if user is trying to join the same class he is in
  if (channel_name == currentChannel) {
    console.log("user is already in this channel");
    return;
  }
  // make sure that we already have a username for person
  if (username != null && username != undefined && username != "") {
    // check if channel exists
    sb.connect(username, function(user, error) {
      doesChannelExist(channel_name, sb);
    });
  }
}

function doesChannelExist(channel_name, connection) {
  var openChannelListQuery = connection.OpenChannel.createOpenChannelListQuery();

  openChannelListQuery.next(function (response, error) {
      if (error) {
          console.log(error);
          return;
      }
      $("#channel").val(channel_name);
      for (var i = 0; i < response.length; i++) {
          channel = response[0];
          if (channel.name == channel_name) {
            console.log("channel exists, trying to connect");
            enterChannel(channel.url, connection);
            return;
          }
      }
      console.log("channel does not exist, trying to create it");
      createChannel(channel_name, connection);
  });
}

function createChannel(course_name, connection) {
  connection.OpenChannel.createChannel(course_name, "", "", function (channel, error) {
      if (error) {
          console.error(error);
          return;
      }
      this.channel = channel;
      setUpConnectionHandler(connection);
      console.log(getOldMessages(channel));
      console.log("creating channel");
      console.log(channel);
  });
}

function enterChannel(channel_url, connection) {
  connection.OpenChannel.getChannel(channel_url, function (channel, error) {
    if (error) {
        console.error(error);
        return;
    }

    channel.enter(function(response, error){
        if (error) {
            console.error(error);
            return;
        }
        this.channel = channel;
        setUpConnectionHandler(connection);
        console.log(getOldMessages(channel));
        console.log("entered channel");
    });
  });
}

function setUpConnectionHandler(connection) {
  channelHandler = new connection.ChannelHandler();
  channelHandler.onMessageReceived = function(channel, message){
    console.log(channel, message);
  };
  connection.addChannelHandler("this is unique", channelHandler);
}

function sendMessage(message) {
  if (message == "" || message == undefined || message == null) {
    return;
  }
  channel.sendUserMessage(message, "", function(message, error) {
    if (error) {
        console.error(error);
        return;
    }
    //console.log(message);
  });
}

function getOldMessages(channel) {
  var messageListQuery = channel.createPreviousMessageListQuery();

  messageListQuery.load(200, true, function(messageList, error){
      if (error) {
          console.error(error);
          return;
      }
      console.log(messageList);
  });
}

function exitChannel(channel) {

}
