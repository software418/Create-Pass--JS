import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../atoms/Button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { usePagination, DOTS } from '../../hooks/usePagination';
export const Pagination = ({ onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, }) => {
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
    });
    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }
    const onNext = () => {
        onPageChange(currentPage + 1);
    };
    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };
    const lastPage = paginationRange[paginationRange.length - 1];
    return (_jsxs("ul", { className: "flex items-center space-x-2", children: [_jsx("li", { children: _jsx(Button, { variant: "outline", size: "icon", onClick: onPrevious, disabled: currentPage === 1, children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }) }), paginationRange.map((pageNumber, idx) => {
                if (pageNumber === DOTS) {
                    return (_jsx("li", { className: "flex h-10 w-10 items-center justify-center", children: _jsx(MoreHorizontal, { className: "h-4 w-4" }) }, idx));
                }
                return (_jsx("li", { children: _jsx(Button, { variant: pageNumber === currentPage ? 'primary' : 'ghost', size: "icon", onClick: () => onPageChange(pageNumber), children: pageNumber }) }, idx));
            }), _jsx("li", { children: _jsx(Button, { variant: "outline", size: "icon", onClick: onNext, disabled: currentPage === lastPage, children: _jsx(ChevronRight, { className: "h-4 w-4" }) }) })] }));
};
