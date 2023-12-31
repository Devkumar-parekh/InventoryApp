"use client";
import Header from "@/components/Header";
import axios from "axios";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import {
  Button,
  Card,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
function SearchBarFallback() {
  return <>placeholder</>;
}

export default function Home() {
  const [formDet, setFormDet] = useState({
    name: "",
    qty: "",
    price: "",
  });
  const [Dropdownlist, setDropdownlist] = useState([]);
  const [searchLoader, setSearchLoader] = useState(false);
  const [SubmitLoader, setSubmitLoader] = useState(false);

  const [searchFormDet, setsearchFormDet] = useState({
    query: "",
    category: "",
  });
  const [inventoryList, setinventoryList] = useState([]);
  const getInventory = async () => {
    try {
      const res = await axios.get("/api/getProducts");
      setinventoryList(res.data?.Data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getInventory();
  }, []);
  const handleUpdate = (e) => {
    setFormDet((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleSubmit = async () => {
    try {
      setSubmitLoader(true);
      const res = await axios.post("/api/setProducts", formDet);
      alert(res.data.Message);
      if (res.data.Status) {
        getInventory();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setSubmitLoader(false);
    }
  };

  const handleSearchForm = (e) => {
    setsearchFormDet((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    handleSearch(e.target.value);
  };
  const handleSearch = async (query = searchFormDet?.query) => {
    console.log(searchFormDet, "searchFormDet");
    if (!searchLoader) {
      try {
        setSearchLoader(true);
        const res = await axios.get(`/api/searchProducts?query=${query}`);
        if (res.data?.Status) {
          setDropdownlist(res.data?.Data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setSearchLoader(false);
      }
    }
  };
  return (
    <div className="bg-darkBlue">
      <Header />
      <div className="container mx-auto text-light p-5 ">
        <h1 className="text-center fw-bold fs-1 bg-lightPink">
          Search products
        </h1>
        <Card className="bg-lightBlue my-3">
          <Card.Body>
            <Suspense fallback={<SearchBarFallback />}>
              <InputGroup className="mb-3">
                <Form.Control
                  aria-label="Text input with dropdown button"
                  placeholder="Search..."
                  name="query"
                  value={searchFormDet?.query}
                  onChange={handleSearchForm}
                />
                {/* <Form.Select
            aria-label="Default select example"
            name="category"
            value={searchFormDet?.category}
            onChange={handleSearchForm}
          >
            <option value="1">All</option>
            <option value="2">Cate1</option>
            <option value="3">Cate2</option>
          </Form.Select> */}
                {/* <Button onClick={handleSearch}>Search</Button> */}
              </InputGroup>
            </Suspense>
            <div>
              {searchLoader ? (
                <>Loading...</>
              ) : (
                <>
                  {Dropdownlist?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="d-flex justify-content-between"
                      >
                        <div className="text-start w-100">{item?.name}</div>
                        <div className="text-start w-100">{item?.qty}</div>
                        <div className="text-start w-100">${item?.price}</div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </Card.Body>
        </Card>
        <h1 className="text-center fw-bold fs-1 bg-lightPink">Add a product</h1>
        <Card className="bg-lightBlue my-3">
          <Card.Body>
            {" "}
            <div className="mb-4 ">
              {/* <label className="block mb-2">Name</label>
          <input
            className="w-full border-gray-300 px-4 py-2"
            name="name"
            value={formDet?.name}
            onChange={(e) => handleUpdate(e)}
          /> */}
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  // placeholder="name@example.com"
                  name="name"
                  value={formDet?.name}
                  onChange={(e) => handleUpdate(e)}
                />
              </Form.Group>
            </div>
            <div className="mb-4">
              {/* <label className="block mb-2">Qty</label>
          <input
            type="number"
            className="w-full border-gray-300 px-4 py-2"
            name="qty"
            value={formDet?.qty}
            onChange={(e) => handleUpdate(e)}
          /> */}

              <Form.Group className="mb-3">
                <Form.Label>Qty</Form.Label>
                <Form.Control
                  type="number"
                  // placeholder="name@example.com"
                  name="qty"
                  value={formDet?.qty}
                  onChange={(e) => handleUpdate(e)}
                />
              </Form.Group>
            </div>
            <div className="mb-4">
              {/* <label className="block mb-2">Price</label>
          <input
            type="number"
            className="w-full border-gray-300 px-4 py-2"
            name="price"
            value={formDet?.price}
            onChange={(e) => handleUpdate(e)}
          /> */}

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  // placeholder="name@example.com"
                  name="price"
                  value={formDet?.price}
                  onChange={(e) => handleUpdate(e)}
                />
              </Form.Group>
            </div>
            <div className="mb-4">
              {/* <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </button> */}

              {SubmitLoader ? (
                <>Loading...</>
              ) : (
                <>
                  <Button
                    variant="primary"
                    className="bg-lightPink"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    {" "}
                    Submit
                  </Button>
                </>
              )}
            </div>
          </Card.Body>
        </Card>
        <h1 className="text-center fw-bold fs-1 bg-lightPink">
          Display Current Stock
        </h1>
        <Card className="bg-lightBlue my-3">
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {inventoryList?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="px-4 py-2 border">{item?.name}</td>
                      <td className="px-4 py-2 border">{item?.qty}</td>
                      <td className="px-4 py-2 border">{item?.price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
