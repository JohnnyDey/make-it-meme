package com.geymaster.memes.controller.integration;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;

public class TwitchAuth {

  public static String getUserId(String token) {
    if (StringUtils.isEmpty(token)) {
      return null;
    }
    try (CloseableHttpClient client = HttpClients.createDefault()) {
      HttpGet get = new HttpGet("https://api.twitch.tv/helix/users");
      get.addHeader("Authorization", "Bearer " + token);
      // todo: move to env:
      get.addHeader("Client-Id", "");

      CloseableHttpResponse response = client.execute(get);
      JSONObject jsonObject = new JSONObject(EntityUtils.toString(response.getEntity(), "UTF-8"));
      return (String) ((JSONObject) ((JSONArray) jsonObject.get("data")).get(0)).get("id");
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }
}
