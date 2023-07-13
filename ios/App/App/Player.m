//
//  Player.m
//  App
//
//  Created by Victor Yurkin on 7/13/23.
//


#import <Capacitor/Capacitor.h>

CAP_PLUGIN(PlayerIosPlugin, "PlayerIos",
   CAP_PLUGIN_METHOD(play, CAPPluginReturnPromise);
)

