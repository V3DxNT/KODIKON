from fastapi import Header, HTTPException

def get_current_role(x_role: str = Header(default="receptionist")) -> str:
    """Reads role header for general audit logging."""
    return x_role.lower()

def require_admin(x_role: str = Header(default="receptionist")) -> str:
    """Enforces admin access for destructive / approval actions."""
    if x_role.lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail="Forbidden: admin role required for this action"
        )
    return x_role.lower()
