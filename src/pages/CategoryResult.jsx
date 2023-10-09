import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/product/Card";
import Pagination from "@mui/material/Pagination";
import style from "../css/CategoryResult.module.css";
import Loading from "../components/Loading";

const CategoryResult = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryNames, setCategoryNames] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const findNodeAndPath = (categories, categoryId, path = []) => {
        for (let category of categories) {
            if (category.categoryId === categoryId) {
                return [...path, category.name];
            }

            if (category.child) {
                const foundInChild = findNodeAndPath(category.child, categoryId, [...path, category.name]);
                if (foundInChild) {
                    return foundInChild;
                }
            }
        }
        return null;
    };

    useEffect(() => {
        const getProudctList = async () => {
            try {
                const categoryRes = await axios.get("/api/public/categories");
                if (categoryRes.data.code === 200) {
                    const pathNames = findNodeAndPath(categoryRes.data.data[0].child, parseInt(id));
                    setCategoryNames(pathNames || []);
                    console.log(categoryRes.data.data);
                }

                const res = await axios.get(`/api/public/categories/${id}/items`, {
                    params: {
                        sortType: "desc", // 기본값
                        pageNum: pageNum - 1, // 기본값
                        pageSize: 9, // 기본값
                    },
                });

                if (res.data.code === 200) {
                    setProducts(res.data.data.items);
                    setTotalPages(res.data.data.totalPage);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getProudctList();
    }, [id, pageNum]);

    const handlePageChange = (event, value) => {
        setPageNum(value);
    };

    return loading ? (
        <Loading content="카테고리 목록을 불러오는 중입니다." />
    ) : (
        <div className={style.container}>
            <div className={style.item}>{categoryNames.join("/")}</div>
            <div className="card-list">
                {products.map((product) => (
                    <Card key={product.itemId} product={product} />
                ))}
            </div>
            <div className={style.item}>
                <Pagination count={totalPages} page={pageNum} onChange={handlePageChange} />
            </div>
            <style jsx>{`
                .card-list {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-gap: 20px;
                    width: 660px;
                }
            `}</style>
        </div>
    );
};

export default CategoryResult;
