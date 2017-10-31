using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class APITest : MonoBehaviour {
    string baseURL = "http://localhost:5333";

    // Use this for initialization
    IEnumerator Start () {
        yield return AddUser("ct@ct", "ctName", "ctNickName");
        yield return GetUser("ct@ct");
        yield return UpdateUser("ct@ct", "ctNameUpdated", "ctNickNameUpdated");
        yield return RemoveUser("ct@ct");

	}
	
	// Update is called once per frame
	void Update () {
		
	}

    IEnumerator AddUser(string email, string userName, string nickName)
    {
        WWWForm form = new WWWForm();
        form.AddField("email", email);
        form.AddField("userName", userName);
        form.AddField("nickName", nickName);

        WWW www = new WWW(baseURL + "/user/add", form);
        yield return www;
        if (!string.IsNullOrEmpty(www.error))
            print("Request error: " + www.error);
        else
            // show the highscores
            Debug.Log(www.text);
    }

    IEnumerator GetUser(string email)
    {
        WWW www = new WWW(baseURL + "/user/" + email);
        yield return www;
        if (!string.IsNullOrEmpty(www.error))
            print("Request error: " + www.error);
        else
            // show the highscores
            Debug.Log(www.text);
    }

    IEnumerator UpdateUser(string email, string userName, string nickName)
    {
        WWWForm form = new WWWForm();
        form.AddField("email", email);
        form.AddField("userName", userName);
        form.AddField("nickName", nickName);

        WWW www = new WWW(baseURL + "/user/update", form);
        yield return www;
        if (!string.IsNullOrEmpty(www.error))
            print("Request error: " + www.error);
        else
            // show the highscores
            Debug.Log(www.text);
    }

    IEnumerator RemoveUser(string email)
    {
        WWWForm form = new WWWForm();
        form.AddField("email", email);

        WWW www = new WWW(baseURL + "/user/remove", form);
        yield return www;
        if (!string.IsNullOrEmpty(www.error))
            print("Request error: " + www.error);
        else
            // show the highscores
            Debug.Log(www.text);
    }


}
