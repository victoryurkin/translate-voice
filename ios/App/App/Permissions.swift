//
//  Permissions.swift
//  App
//
//  Created by Victor Yurkin on 7/13/23.
//

import Foundation
import Capacitor
import AVFoundation

@objc(PermissionsIosPlugin)
public class PermissionsIosPlugin: CAPPlugin {
    @objc func grantPermission(_ call: CAPPluginCall) {
        let type = call.getString("type") ?? ""
        switch type {
            case "microphone":
                print("Checking access to microphone")
            switch AVAudioSession.sharedInstance().recordPermission {
            case .granted:
                print("Microphone permission has already been granted")
            case .denied:
                print("Microphone permission was denied")
            case .undetermined:
                print("Requesting microphone permission...")
                AVAudioSession.sharedInstance().requestRecordPermission({ granted in
                    print("Microphone permission successfully granted")
                })
            default:
                print("Unknown microphone permission status")
            }
        default:
                print("Unknown permissions request")
        }
        call.resolve(["response": type])
    }
}
