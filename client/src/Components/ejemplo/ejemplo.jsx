/* IMPORTS */
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import {
    orderAlphabetic,
    orderPrice,
    filterCategoryAndType,
    getAllProducts,
} from "../../redux/actions/actionsProducts";
import DashboardCard from "../dashboardCard/dashboardCard";
import Loading from "../../../Views/Loading/Loading";
import SearchBar from "../../searchBar/searchBar";
import {
    Box,
    Pagination,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
} from "@mui/material";

/* COMPONENT */
const DashboardCardCont = () => {
    const dispatch = useDispatch();
    const productsArray = useSelector((state) => state.product);
    const categories = useSelector((state) => state.category);

    const [resetFilters, setResetFilters] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    const [pageProducts, setPageProducts] = useState([]);
    const [page, setPage] = useState({
        current: 1,
        total: Math.ceil(productsArray.length / 5),
    });

    const pageCurrentRef = useRef(page.current);

    function loadProducts() {
        dispatch(getAllProducts());
    }

    /* USE EFFECT */
    useEffect(() => {
        let filteredProducts = [...productsArray];
        // Filtrar por categoría
        if (categoryFilter !== "ALL") {
            filteredProducts = filteredProducts.filter((product) =>
                product.categories.includes(categoryFilter)
            );
        }
        // Filtrar por tipo
        if (typeFilter !== "ALL") {
            filteredProducts = filteredProducts.filter(
                (product) => product.type === typeFilter
            );
        }
        if (resetFilters) {
            setCategoryFilter("ALL");
            setTypeFilter("ALL");
            setResetFilters(false);
        }
        const startIndex = (pageCurrentRef.current - 1) * 5;
        const endIndex = startIndex + 5;
        setPageProducts(filteredProducts.slice(startIndex, endIndex));
        setPage((prevPage) => ({
            ...prevPage,
            total: Math.ceil(filteredProducts.length / 5),
        }));
    }, [
        productsArray,
        categoryFilter,
        typeFilter,
        pageCurrentRef,
        resetFilters,
    ]);

    /* HANDLERS */
    const styles = {
        scrollContainer: {
            height: "70vh",
            width: "90%",
            margin: "0 auto",
            overflow: "auto",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.112)",
            scrollbarWidth: "thin",
            scrollbarColor: "#a49856 #d5cda4",
            "&::-webkit-scrollbar": {
                width: "10px",
                borderRadius: "25px",
            },
            "&::-webkit-scrollbar-track": {
                background: "#d5cda4",
            },
            "&::-webkit-scrollbar-thumb": {
                background: "#a49856",
                borderRadius: "25px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                background: "#c8bd81",
            },
        },
    };

    const handleResetFilters = () => {
        setResetFilters(true);
    };

    const handleChange = (event, value) => {
        const startIndex = (value - 1) * 5;
        const endIndex = startIndex + 5;

        // Filtrar por categoría y tipo
        let filteredProducts = [...productsArray];
        if (categoryFilter !== "ALL") {
            filteredProducts = filteredProducts.filter((product) =>
                product.categories.includes(categoryFilter)
            );
        }
        if (typeFilter !== "ALL") {
            filteredProducts = filteredProducts.filter(
                (product) => product.type === typeFilter
            );
        }

        setPage((prevPage) => ({ ...prevPage, current: value }));
        setPageProducts(filteredProducts.slice(startIndex, endIndex));
    };

    const handleAlphabeticOrder = (event) => {
        const value = event.target.value;
        if (value === "") {
            dispatch(orderAlphabetic("none"));
        } else {
            dispatch(orderAlphabetic(value));
        }
    };

    const handlePriceOrder = (e) => {
        const value = e.target.value;
        dispatch(orderPrice(value));
    };

    const handleFilterCategory = (e) => {
        const value = e.target.value;
        setPage((prevPage) => ({ ...prevPage, current: 1 }));
        setCategoryFilter(value);
        dispatch(filterCategoryAndType(value, typeFilter));
    };

    const handleFilterType = (e) => {
        const value = e.target.value;
        setPage((prevPage) => ({ ...prevPage, current: 1 }));
        setTypeFilter(value);
        dispatch(filterCategoryAndType(categoryFilter, value));
    };

    /* RENDERIZADO */
    return (
        <Box
            sx={{
                backgroundColor: "#dddddd",
                height: "88.82vh",
            }}
        >
            <Box
                sx={{
                    height: "15%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        height: "60%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <SearchBar />
                </Box>
                <Box
                    sx={{
                        height: "40%",
                        display: "flex",
                        width: "90%",
                        margin: "0 auto",
                    }}
                >
                    <FormControl fullWidth size="small" sx={{ width: "150px" }}>
                        <InputLabel id="alphabetic" color="primary">
                            A - Z
                        </InputLabel>
                        <Select
                            color="primary"
                            labelId="alphabetic"
                            id="alphabetic"
                            label="A - Z"
                            sx={{ width: "110px" }}
                            onChange={handleAlphabeticOrder}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="asc">A - Z</MenuItem>
                            <MenuItem value="desc">Z - A</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small" sx={{ width: "150px" }}>
                        <InputLabel id="price" color="primary">
                            PRICE
                        </InputLabel>
                        <Select
                            color="primary"
                            labelId="price"
                            id="price"
                            onChange={handlePriceOrder}
                            label="PRICE"
                            sx={{ width: "110px" }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="asc">ASC</MenuItem>
                            <MenuItem value="desc">DESC</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small" sx={{ width: "150px" }}>
                        <InputLabel id="category" color="primary">
                            CATEGORY
                        </InputLabel>
                        <Select
                            color="primary"
                            labelId="category"
                            id="category"
                            label="CATEGORY"
                            sx={{ width: "130px" }}
                            onChange={handleFilterCategory}
                        >
                            <MenuItem value="ALL">ALL</MenuItem>
                            {categories.map((category) => (
                                <MenuItem
                                    key={category.name}
                                    value={category.name}
                                >
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small" sx={{ width: "150px" }}>
                        <InputLabel id="type" color="primary">
                            TYPE
                        </InputLabel>

                        <Select
                            color="primary"
                            labelId="type"
                            id="type"
                            label="TYPE"
                            onChange={handleFilterType}
                            sx={{ width: "110px" }}
                        >
                            <MenuItem value="ALL">ALL</MenuItem>
                            <MenuItem value="Comida">Comida</MenuItem>
                            <MenuItem value="Bebida">Bebida</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        onClick={handleResetFilters}
                        sx={{
                            backgroundColor: "#E29578",
                            color: "#EDF6F9",
                            height: "40px",
                            "&:hover": {
                                backgroundColor: "#E29578",
                                color: "#EDF6F9",
                            },
                        }}
                    >
                        RESET FILTERS
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    height: "8%",
                    ...styles.scrollContainer,
                }}
            >
                {pageProducts.length > 0 ? (
                    pageProducts.map((e) => (
                        <Box key={e.id}>
                            <DashboardCard element={e} />
                        </Box>
                    ))
                ) : (
                    <Box>
                        <Loading />
                    </Box>
                )}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "8vh",
                }}
            >
                <Pagination
                    count={page.total}
                    page={page.current}
                    variant="outlined"
                    showFirstButton
                    showLastButton
                    onChange={handleChange}
                />
            </Box>
        </Box>
    );
};

export default DashboardCardCont;
