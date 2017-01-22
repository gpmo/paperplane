var sb = new SendBird({"appId":"B27C3E56-E48A-4CC4-B788-10E163501C17"});

function joinChannel(channel_name) {
  var username = $("#username").val();
  var currentChannel = $("#channel").val();
  if (channel_name == currentChannel) {
    console.log("user is already in this channel");
    return;
  }
  // make sure that we already have a username for person
  if (username != null && username != undefined && username != "") {
    // check if channel exists
    sb.connect(username, function(user, error) {
      if (doesChannelExist(channel_name)) {
        createChannel(channel_name, sb);
      } else {
        enterChannel(channel_name, sb);
      }
    });
  }
}

function createChannel(course_name, connection) {
  connection.OpenChannel.createChannel(course_name, "", "", function (channel, error) {
      if (error) {
          console.error(error);
          return;
      }
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
    });
});
}

    var openChannelListQuery = sb.OpenChannel.createOpenChannelListQuery();

    openChannelListQuery.next(function (response, error) {
        if (error) {
            console.log(error);
            return;
        }

        console.log(response);
    });
  });
}
