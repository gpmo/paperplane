var sb = new SendBird({"appId":"B27C3E56-E48A-4CC4-B788-10E163501C17"});
var channelObject = undefined;
var channelHandler;

function joinChannel(channel_name) {
  var username = $("#username").val();
  var currentChannel = $("#channel").val();
  // check if user is trying to join the same class he is in
  if (channel_name == currentChannel) {
    console.log("user is already in this channel");
    return true;
  }
  // make sure that we already have a username for person
  if (username != null && username != undefined && username != "") {
    // check if channel exists
    sb.connect(username, function(user, error) {
      accessChannel(channel_name, sb);
    });
  }
}

function accessChannel(channel_name, connection) {
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
      exitChannel(channelObject);
      channelObject = channel;
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

    exitChannel(channelObject);
    channel.enter(function(response, error){
        if (error) {
            console.error(error);
            return;
        }
        channelObject = channel;
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
    appendMessageToChat(message);
    $('#pp-scrollable')[0].scrollTop += 25;
  };
  connection.addChannelHandler("this is unique", channelHandler);
}

function sendMessage(message) {
  if (message == "" || message == undefined || message == null) {
    return;
  }
  channel.sendUserMessage(message, "", function(messageObject, error) {
    if (error) {
        console.error(error);
        return;
    }
    appendMessageToChat(messageObject);
    $('#pp-scrollable').scrollTop($('#pp-scrollable')[0].scrollHeight);
  });
}

function getOldMessages(channel) {
  var messageListQuery = channel.createPreviousMessageListQuery();

  messageListQuery.load(200, true, function(messageList, error){
      if (error) {
          console.error(error);
          return;
      }
      $.get("/get-class-times?id=" + channel.name, function(data) {
        var start_time = data['start_time'];
        var end_time = data['end_time'];
        for (var i = messageList.length - 1; i >= 0; i--) {
          var message = messageList[i];
          if (checkTime(start_time, end_time, message.createdAt)) {
            appendMessageToChat(message);
          }
        }
        $('#pp-scrollable').scrollTop($('#pp-scrollable')[0].scrollHeight);
        console.log(messageList);
      });
  });
}

function checkTime(start_time, end_time, createdAt) {
  var start_date = new Date();
  var end_date = new Date();
  start_date.setHours(parseInt(start_time/60));
  end_date.setHours(parseInt(end_time/60));
  var start_mins = start_time - parseInt(start_time/60) * 60;
  var end_mins = end_time - parseInt(end_time/60) * 60;
  start_date.setMinutes(start_mins);
  end_date.setMinutes(end_mins);
  return createdAt >= start_date && createdAt <= end_date;
}

function appendMessageToChat(message) {
  var time = unixToTime(message.createdAt);
  if ($("#username").val() == message.sender.userId) {
    $("#main-chat").append("<p><pp-yellow>[" + time + "] " +
      message.sender.userId + ": </pp-yellow>" + message.message +"</p>");
  } else {
    $("#main-chat").append("<p><pp-blue>[" + time + "] " +
      message.sender.userId + ": </pp-blue>" + message.message +"</p>");
  }
}

function exitChannel(channel) {
  if (channel != null && channel != "" && channel != undefined) {
    channel.exit(function(response, error) {
        if (error) {
            console.error(error);
            return;
        }
        console.log("exited channel " + channel.name);
    });
  }
}

function deleteChannel(channel) {
  if (channel != null || channel != undefined) {

  }
}
