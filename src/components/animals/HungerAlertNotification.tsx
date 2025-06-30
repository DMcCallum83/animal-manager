import React from "react";
import { HungerAlert } from "../../types";
import { getHungerAlertMessage } from "../../utils/gameLogic";
import "./HungerAlertNotification.scss";

interface HungerAlertNotificationProps {
  alerts: HungerAlert[];
  onDismiss?: (alertId: string) => void;
  onFeedAnimal?: (animalId: string) => void;
  maxDisplayed?: number;
}

export const HungerAlertNotification: React.FC<
  HungerAlertNotificationProps
> = ({ alerts, onDismiss, onFeedAnimal, maxDisplayed = 3 }) => {
  if (alerts.length === 0) {
    return null;
  }

  const displayedAlerts = alerts.slice(0, maxDisplayed);
  const hasMore = alerts.length > maxDisplayed;

  const handleDismiss = (alert: HungerAlert) => {
    onDismiss?.(`${alert.animalId}-${alert.timestamp.getTime()}`);
  };

  const handleFeedAnimal = (alert: HungerAlert) => {
    onFeedAnimal?.(alert.animalId);
  };

  return (
    <div className="hunger-alert-container">
      <div className="hunger-alert-header">
        <h3 className="hunger-alert-title">
          🍽️ Hunger Alerts ({alerts.length})
        </h3>
        {hasMore && (
          <span className="hunger-alert-more">
            +{alerts.length - maxDisplayed} more
          </span>
        )}
      </div>

      <div className="hunger-alert-list">
        {displayedAlerts.map((alert) => (
          <div
            key={`${alert.animalId}-${alert.timestamp.getTime()}`}
            className={`hunger-alert-item ${alert.isUrgent ? "urgent" : ""}`}
          >
            <div className="hunger-alert-content">
              <div className="hunger-alert-message">
                {getHungerAlertMessage(alert)}
              </div>
              <div className="hunger-alert-time">
                {alert.timestamp.toLocaleTimeString()}
              </div>
            </div>

            <div className="hunger-alert-actions">
              {onFeedAnimal && (
                <button
                  className="hunger-alert-feed-btn"
                  onClick={() => handleFeedAnimal(alert)}
                  title="Feed this animal"
                >
                  🍖 Feed
                </button>
              )}
              {onDismiss && (
                <button
                  className="hunger-alert-dismiss-btn"
                  onClick={() => handleDismiss(alert)}
                  title="Dismiss alert"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
