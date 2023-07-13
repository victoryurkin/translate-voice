//
//  Player.swift
//  App
//
//  Created by Victor Yurkin on 7/13/23.
//

import Foundation
import Capacitor
import AVFoundation

@objc(PlayerIosPlugin)
public class PlayerIosPlugin: CAPPlugin {
    private var player: AVAudioPlayer?
    
    @objc func play(_ call: CAPPluginCall) {
        let file = call.getString("file")
        if (file != nil) {
            DispatchQueue.main.sync {
                print("Playing file...")
                let audioData = Data(base64Encoded: file!, options: .ignoreUnknownCharacters)
                let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
                let documentDirectory = paths[0]
                let filename = documentDirectory.appendingPathComponent("output.mp3")
                do {
                    try audioData!.write(to: filename, options: .atomicWrite)
                    player = try AVAudioPlayer(contentsOf: filename)
                    player!.play()
                } catch let error {
                    print(error.localizedDescription)
                }
            }
        }
        call.resolve(["response": "Success!"])
    }
}

