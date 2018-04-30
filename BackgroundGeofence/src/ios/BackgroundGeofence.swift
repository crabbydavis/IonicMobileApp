@objc(BackgroundGeofence) class BackgroundGeofence : CDVPlugin {
  @objc(monitorGeofence:)
  func monitorGeofence(command: CDVInvokedUrlCommand) {
    var pluginResult = CDVPluginResult(
      status: CDVCommandStatus_ERROR
    )

    let coordinates = command.arguments[0] as? String ?? ""
    //let coordinates = command.arguments[0] as? Dictionary ?? [longitud:0, lattidude: 0]

    let toastController: UIAlertController =
      UIAlertController(
        title: "Plugin",
        message: "In the plugin",
        preferredStyle: .alert
      )
      
    self.viewController?.present(
      toastController,
      animated: true,
      completion: nil
    )

    DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
        toastController.dismiss(
            animated: true,
            completion: nil
        )
    }

    pluginResult = CDVPluginResult(
    status: CDVCommandStatus_OK,
    messageAs: coordinates
    )

    self.commandDelegate!.send(
      pluginResult,
      callbackId: command.callbackId
    )
  }
}
