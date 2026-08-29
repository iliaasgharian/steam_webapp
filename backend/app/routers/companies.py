"""
Public endpoints for browsing companies (developers/publishers).
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.company import Company
from app.schemas.company import CompanyListResponse, CompanyListItem, CompanyDetail, CompanyGameItem

router = APIRouter(prefix="/api/companies", tags=["companies"])


@router.get("", response_model=CompanyListResponse)
def list_companies(
    q: Optional[str] = Query(None, description="Search by company name"),
    country: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Company)
    if q:
        query = query.filter(Company.name.ilike(f"%{q}%"))
    if country:
        query = query.filter(Company.country.ilike(country))

    total = query.count()
    companies = query.offset((page - 1) * page_size).limit(page_size).all()
    return CompanyListResponse(total=total, results=companies)


@router.get("/{company_id}", response_model=CompanyDetail)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    return CompanyDetail(
        id=company.id,
        name=company.name,
        founded_year=company.founded_year,
        country=company.country,
        headquarters=company.headquarters,
        website=company.website,
        logo_url=company.logo_url,
        description=company.description,
        developed_games=[CompanyGameItem(appid=g.appid, name=g.name) for g in company.developed_games],
        published_games=[CompanyGameItem(appid=g.appid, name=g.name) for g in company.published_games],
    )
