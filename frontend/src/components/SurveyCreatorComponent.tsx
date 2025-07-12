import React from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-core/survey.i18n.min.js";
import "survey-creator-core/survey-creator-core.i18n.min.js";
import "survey-core/survey-core.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import "./index.css";
import SurveyCreatorTheme from "survey-creator-core/themes";
import { registerCreatorTheme } from "survey-creator-core";

registerCreatorTheme(SurveyCreatorTheme); // Add predefined Survey Creator UI themes

function SurveyCreatorRenderComponent() {
    const creator = new SurveyCreator();
    return (<SurveyCreatorComponent creator={creator} />);
}

export default SurveyCreatorRenderComponent;
