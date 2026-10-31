"""
Unit tests for the role dependencies in app/roles.py.

These call the dependency functions directly with an explicit x_role value,
bypassing FastAPI's Header injection. The header-default behavior (a missing
X-Role header is treated as receptionist) is covered at the API level in
test_api.py.
"""
import pytest
from fastapi import HTTPException

from app.roles import require_admin, get_current_role


def test_require_admin_allows_admin():
    assert require_admin(x_role="admin") == "admin"


def test_require_admin_is_case_insensitive():
    assert require_admin(x_role="Admin") == "admin"
    assert require_admin(x_role="ADMIN") == "admin"


def test_require_admin_rejects_receptionist():
    with pytest.raises(HTTPException) as exc:
        require_admin(x_role="receptionist")
    assert exc.value.status_code == 403


def test_require_admin_rejects_unknown_role():
    with pytest.raises(HTTPException) as exc:
        require_admin(x_role="guest")
    assert exc.value.status_code == 403


def test_get_current_role_normalizes_case():
    assert get_current_role(x_role="ADMIN") == "admin"
    assert get_current_role(x_role="Receptionist") == "receptionist"
