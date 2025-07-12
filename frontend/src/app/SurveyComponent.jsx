import React from "react";
import { Model } from "survey-core";
import { PopupSurvey } from "survey-react-ui";
import "survey-core/survey-core.min.css";
import "./index.css";
import { json } from "./survey/json";
import { themeJson } from "./theme";

function SurveyComponent() {
    const survey = new Model(json);
    // You can delete the line below if you do not use a customized theme
    survey.applyTheme(themeJson);
    const handlePopupClose = () => {
        // ...
        // Perform actions when users close the popup
        // ...
    }
    return (<PopupSurvey model={survey} isExpanded={true} closeOnCompleteTimeout={-1} allowClose={true} onClose={handlePopupClose} />);
}

export default SurveyComponent;
  // Save survey results to backend
  survey.onComplete.add((sender) => {
    fetch("/api/save-survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sender.data),
    });
  });

  return <Survey model={survey} />;
