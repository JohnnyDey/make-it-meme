package com.geymaster.memes.controller.integration;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;

public class TwitchAuth {

  public static Pair<String, String> getUserId(String token) {
    try (CloseableHttpClient client = HttpClients.createDefault()) {
      HttpGet get = new HttpGet("https://api.twitch.tv/helix/users");
      get.addHeader("Authorization", "Bearer " + token);
      get.addHeader("Client-Id", "cnev6y1p1y3yyafvt9n3paa3qd3dfl");

      CloseableHttpResponse response = client.execute(get);
      JSONObject jsonObject = new JSONObject(EntityUtils.toString(response.getEntity(), "UTF-8"));
      JSONObject data = ((JSONObject) ((JSONArray) jsonObject.get("data")).get(0));
      return Pair.of((String) data.get("id"), (String) data.get("display_name"));
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }
}
