"""
Public endpoint for best-seller rankings.
NOTE: the data source for sales_charts hasn't been decided yet (see
project proposal) — this endpoint reads whatever exists in the table,
which will be empty until a future fetch job populates it.
"""

from datetime import date as date_type
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.sales_chart import SalesChart

router = APIRouter(prefix="/api/sales-charts", tags=["sales charts"])


@router.get("")
def get_sales_chart(
    period: str = Query(..., pattern="^(weekly|monthly|yearly)$"),
    date: Optional[date_type] = Query(None, description="Reference date within the period"),
    db: Session = Depends(get_db),
):
    query = db.query(SalesChart).filter(SalesChart.period_type == period)

    if date:
        query = query.filter(SalesChart.period_start <= date, SalesChart.period_end >= date)
    else:
        # Default to the most recently recorded period of this type.
        latest = query.order_by(SalesChart.period_start.desc()).first()
        if not latest:
            raise HTTPException(status_code=404, detail="No sales chart data available yet")
        query = query.filter(
            SalesChart.period_start == latest.period_start,
            SalesChart.period_end == latest.period_end,
        )

    entries = query.order_by(SalesChart.rank.asc()).all()
    if not entries:
        raise HTTPException(status_code=404, detail="No sales chart data available for this period")

    return {
        "period_type": period,
        "period_start": entries[0].period_start,
        "period_end": entries[0].period_end,
        "rankings": [
            {"rank": e.rank, "appid": e.game.appid, "name": e.game.name} for e in entries
        ],
    }
