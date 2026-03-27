import re
from typing import Any, Dict, List, Optional, TypeVar

T = TypeVar("T")


# ---------------------------------------------------------------------------
# Phone number helpers
# ---------------------------------------------------------------------------

def format_phone_e164(phone: str) -> str:
    """Normalize a phone number to E.164 format (+1XXXXXXXXXX for US numbers).

    Strips all non-digit characters and prepends +1 if missing a country code.
    Returns the original string if it cannot be parsed.
    """
    if not phone:
        return phone
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 10:
        return f"+1{digits}"
    if len(digits) == 11 and digits.startswith("1"):
        return f"+{digits}"
    if len(digits) > 10:
        return f"+{digits}"
    return phone  # return as-is if we can't normalize


def format_phone_display(phone: str) -> str:
    """Format E.164 phone number for human display: +1 (555) 867-5309."""
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 11 and digits.startswith("1"):
        digits = digits[1:]
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    return phone


# ---------------------------------------------------------------------------
# Pagination helpers
# ---------------------------------------------------------------------------

def paginate(items: List[T], page: int = 1, page_size: int = 20) -> Dict[str, Any]:
    """Return a pagination envelope for a list of items.

    Args:
        items:     Full list of items (already filtered/sorted).
        page:      1-based page number.
        page_size: Number of items per page.

    Returns:
        dict with keys: items, total, page, page_size, pages
    """
    if page < 1:
        page = 1
    total = len(items)
    pages = max(1, (total + page_size - 1) // page_size)
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "items": items[start:end],
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": pages,
    }


def get_skip_limit(page: int = 1, page_size: int = 20) -> tuple[int, int]:
    """Convert page/page_size to SQLAlchemy skip/limit values."""
    if page < 1:
        page = 1
    skip = (page - 1) * page_size
    return skip, page_size


# ---------------------------------------------------------------------------
# Misc helpers
# ---------------------------------------------------------------------------

def truncate(text: str, max_length: int = 100) -> str:
    """Truncate a string to max_length chars, appending '…' if needed."""
    if not text:
        return text
    return text if len(text) <= max_length else text[:max_length - 1] + "…"


def safe_get(d: dict, *keys: str, default: Any = None) -> Any:
    """Safely retrieve a nested value from a dict."""
    val = d
    for key in keys:
        if not isinstance(val, dict):
            return default
        val = val.get(key, default)
    return val
