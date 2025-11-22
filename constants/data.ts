export enum GateNotificationTopics {
  NOTIFICATION_SMALLGATE = 'api/notification/small_gate',
  NOTIFICATION_LIGHT = 'api/notification/garage/light',
  NOTIFICATION_PARTIAL = 'api/notification/gate/partial',
  NOTIFICATION_GATE = 'api/notification/gate',
  NOTIFICATION_GATESTATUS = 'api/notification/gate/status',
  NOTIFICATION_STATISTICS = 'api/notification/statistics',
}

export enum GatePublishTopics {
  PUBLISH_SMALLGATE = 'api/small_gate',
  PUBLISH_LIGHT = 'api/garage/light',
  PUBLISH_PARTIAL = 'api/gate/partial',
  PUBLISH_GATE = 'api/gate',
  PUBLISH_GATESTATUS = 'api/gate/status',
  PUBLISH_GET_STATISTICS = 'api/gate/statistics',
}
