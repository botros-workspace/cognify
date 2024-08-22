import React, { useCallback, useEffect, useState } from 'react'
import './App.css'
import {
  Box,
  Flex,
  HStack,
  Input,
  Select,
  Spinner,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { DataAttributes } from './shared/interfaces/DataAttributes'
import axios from 'axios'
import ReactPaginate from 'react-paginate'

function App() {
  const [data, setData] = useState<DataAttributes[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [sortBy, setSortBy] = useState<string>('id')
  const [sortOrder, setSortOrder] = useState<string>('asc')
  const [filter, setFilter] = useState<string>('')
  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageClick = useCallback((event: { selected: number }) => {
    setCurrentPage(event.selected)
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get<DataAttributes[]>(
        `http://localhost:4000/app?page=${
          currentPage + 1
        }&limit=${itemsPerPage}&sort=${sortBy}&order=${sortOrder}&filter=${filter}`
      )
      setLoading(false)
      setData(response.data)
    } catch (error) {
      setError('An error occurred while fetching data.')
      setLoading(false)
    }
  }, [currentPage, filter, itemsPerPage, sortBy, sortOrder])
  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading)
    return (
      <Flex
        w={'100vw'}
        h={'100vh'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Spinner size='xl' />
      </Flex>
    )
  if (error)
    return (
      <Flex
        w={'100vw'}
        h={'100vh'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <p>{error}</p>
      </Flex>
    )
  return (
    <Flex w={'100vw'} h={'100vh'} flexDir={'column'}>
      <HStack spacing={4} m={4}>
        <Input
          placeholder='Filter by name'
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value)
          }}
        />
        <Select
          placeholder='Sort by'
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value='id'>ID</option>
          <option value='name'>Name</option>
          <option value='price'>Price</option>
        </Select>
        <Select
          placeholder='Order'
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value='asc'>Ascending</option>
          <option value='desc'>Descending</option>
        </Select>
        <Select
          placeholder='Items per page'
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value='10'>10</option>
          <option value='20'>20</option>
          <option value='50'>50</option>
        </Select>
      </HStack>
      <Box py={16} px={4}>
        <Table variant='simple' borderWidth={2} borderRadius={'lg'}>
          <TableCaption>Data from API</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Company</Th>
              <Th>City</Th>
              <Th>Slogan</Th>
              <Th>Support Email</Th>
              <Th>Version</Th>
              <Th>Release Date</Th>
              <Th>Last Updated</Th>
              <Th>Downloads</Th>
              <Th>Price</Th>
              <Th>In-App Purchases</Th>
              <Th>FSK</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((item) => (
              <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>{item.name}</Td>
                <Td>{item.company}</Td>
                <Td>{item.company_city}</Td>
                <Td>{item.slogan}</Td>
                <Td>{item.support_email}</Td>
                <Td>{item.version}</Td>
                <Td>{new Date(item.release_date).toLocaleDateString()}</Td>
                <Td>{new Date(item.last_updated).toLocaleDateString()}</Td>
                <Td>{item.downloads}</Td>
                <Td>${item.price?.toFixed(2)}</Td>
                <Td>{item.in_app_purchases ? 'Yes' : 'No'}</Td>
                <Td>{item.fsk}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Flex
          mt={4}
          gap={4}
          justifyContent={'center'}
          alignItems={'center'}
          w={'100%'}
          flexDir={'column'}
        >
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={Math.ceil(data.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            activeClassName={'active'}
          />
        </Flex>
      </Box>
    </Flex>
  )
}

export default App
