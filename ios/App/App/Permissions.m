//
//  Permissions.m
//  App
//
//  Created by Victor Yurkin on 7/13/23.
//

#import <Capacitor/Capacitor.h>

CAP_PLUGIN(PermissionsIosPlugin, "PermissionsIos",
   CAP_PLUGIN_METHOD(grantPermission, CAPPluginReturnPromise);
)

