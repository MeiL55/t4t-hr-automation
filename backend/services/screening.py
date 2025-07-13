# backend/services/screening.py

import os
from pyresparser import ResumeParser # we can use this library to read resumes
from datetime import datetime

# --- Configuration: The Rules for Screening ---
MIN_GPA = 2.0
MIN_AGE = 16
MAX_AGE = 22
ALLOWED_CITIZENSHIP_STATUSES = ["US Citizen", "Permanent Resident"]
ALLOWED_STUDY_LOCATION = "U.S."

class ApplicantScreeningService:
    #service checks automatically checks in candidate is suitable

    def __init__(self, applicant_data, resume_path):
        """
        Sets up the service with the applicant's info and resume file.

        Args:
            applicant_data (dict): A dictionary with the applicant's answers from the form.
            resume_path (str): The location of the applicant's saved resume file.
        """
        self.applicant_data = applicant_data
        self.resume_path = resume_path
        self.rejection_reasons = [] # keep a list of reasons for rejection here

    def _parse_resume(self):
        """
        Reads the resume to pull out key information like skills and education.
        """
        try:
            print(f"INFO: Reading resume from {self.resume_path}")
            parser = ResumeParser(self.resume_path)
            parsed_data = parser.get_extracted_data()
            print("INFO: Resume read successfully.")
            return parsed_data
        except Exception as e:
            print(f"ERROR: Could not read the resume. Reason: {e}")
            self.rejection_reasons.append(f"Could not read the resume file.")
            return None

    def _check_minimum_criteria(self):
        """
        Checks the applicant's form answers against our rules.
        """
        # 1. GPA Check
        applicant_gpa = float(self.applicant_data.get('gpa', 0))
        if applicant_gpa < MIN_GPA:
            self.rejection_reasons.append(f"GPA is below the minimum required.")

        # 2. Age Check
        applicant_age = int(self.applicant_data.get('age', 0))
        if not (MIN_AGE <= applicant_age <= MAX_AGE):
            self.rejection_reasons.append(f"Age is outside the permitted range.")

        # 3. Citizenship/Work Status Check
        applicant_status = self.applicant_data.get('citizenshipStatus')
        if applicant_status not in ALLOWED_CITIZENSHIP_STATUSES:
            self.rejection_reasons.append(f"Citizenship status is not eligible.")

        # 4. Study Location Check
        study_location = self.applicant_data.get('studyLocation')
        if study_location != ALLOWED_STUDY_LOCATION:
             self.rejection_reasons.append(f"Must be studying in the U.S.")

        # 5. Criminal Record Check
        has_felony = self.applicant_data.get('felonyDisclosed', 'false').lower() == 'true'
        has_misdemeanor = self.applicant_data.get('misdemeanorDisclosed', 'false').lower() == 'true'
        if has_felony or has_misdemeanor:
            self.rejection_reasons.append("Disclosure of a misdemeanor or felony.")

    def screen_applicant(self):
        """
        Runs the full check on the applicant.

        Returns:
            A dictionary saying if they are 'qualified' (True/False) and the 'reasons' why.
        """
        print("INFO: Starting applicant screening process...")
        # First, try to read the resume.
        parsed_resume = self._parse_resume()
        
        # check all the answers from the form.
        self._check_minimum_criteria()

        # make a decision.
        is_qualified = not self.rejection_reasons
        
        if is_qualified:
            print("RESULT: Applicant QUALIFIED for the next round.")
            return {
                "qualified": True,
                "reasons": [],
                "parsed_resume": parsed_resume # We can send back the info from the resume
            }
        else:
            print(f"RESULT: Applicant REJECTED. Reasons: {self.rejection_reasons}")
            return {
                "qualified": False,
                "reasons": self.rejection_reasons,
                "parsed_resume": parsed_resume
            }
