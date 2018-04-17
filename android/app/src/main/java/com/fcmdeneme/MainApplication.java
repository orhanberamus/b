package com.fcmdeneme;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import io.realm.react.RealmReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
   private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
   protected static CallbackManager getCallbackManager() {
      return mCallbackManager;
    }
   private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SvgPackage(),
            new RealmReactPackage(),
            new VectorIconsPackage(),
            new FIRMessagingPackage(),
            new FBSDKPackage(mCallbackManager)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
