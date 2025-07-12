ALLOWED_TRANSITIONS = {
    "submitted": ["interview_1", "rejected"],
    "interview_1": ["interview_2", "rejected"],
    "interview_2": ["offer_sent", "rejected"],
    "offer_sent": ["hired", "rejected"],
    "rejected": [],
    "hired": [],
}
def is_valid_transition(current_stage: str, new_stage: str) -> bool:
    return new_stage in ALLOWED_TRANSITIONS.get(current_stage, [])
