import React, {FC} from 'react'
import {useDispatch} from "react-redux"
import {actions, AppDispatch} from "../../reducers/EditorReducer"
import {PageState} from "../../state/Enums"
import {nodeApi, useGetSharesQuery} from "../../apis/NodeApi"
import {Modal, Table,} from 'flowbite-react'

export const ModalShares: FC = () => {
  const { data } = useGetSharesQuery()
  let { shareDataExport, shareDataImport } = data || { shareDataExport: [], shareDataImport: []}
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Modal
      theme={{
        root: {
          show: {
            on: "flex bg-zinc-700 bg-opacity-25 dark:bg-opacity-40"
          }
        },
        content: {
          base: "top-[64px] relative h-full w-full p-4 md:h-auto",
          inner: "relative rounded-lg bg-white shadow dark:bg-zinc-800 flex flex-col max-h-[90vh]"
        }
      }}
      show={true}
      onClose={() => dispatch(actions.setPageState(PageState.WS))}
      position="top-center"
      size="4xl"
    >
      <Modal.Header>{'Shares'}</Modal.Header>
      <Modal.Body>
        <Table>
          <Table.Head className="text-xs text-white uppercase bg-blue-600 dark:text-white">
            <Table.HeadCell className="bg-zinc-300 dark:bg-zinc-600">{'Map Name'}</Table.HeadCell>
            <Table.HeadCell className="bg-zinc-300 dark:bg-zinc-600">{'Shared With'}</Table.HeadCell>
            <Table.HeadCell className="bg-zinc-300 dark:bg-zinc-600">{'Access'}</Table.HeadCell>
            <Table.HeadCell className="bg-zinc-300 dark:bg-zinc-600">{'Status'}</Table.HeadCell>
            <Table.HeadCell className="bg-zinc-300 dark:bg-zinc-600">{'Actions'}</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {
              shareDataExport.map((el: { _id: string, sharedMapName: string, shareUserEmail: string, access: string, status: string  }) =>
                <Table.Row key={el._id} className="bg-white dark:border-gray-700 dark:bg-zinc-700">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{el.sharedMapName}</Table.Cell>
                  <Table.Cell>{el.shareUserEmail}</Table.Cell>
                  <Table.Cell>{el.access}</Table.Cell>
                  <Table.Cell>{el.status}</Table.Cell>
                  <Table.Cell>
                    <a
                      onClick={() => window.alert('TODO: implement')/*dispatch(nodeApi.endpoints.withdrawShare.initiate({shareId: el._id}))*/}
                      className="font-medium text-cyan-600 hover:underline hover:cursor-pointer dark:text-cyan-500"
                    >{'Withdraw'}</a>
                  </Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>
        </Table>
        <br/>
        <Table>
          <Table.Head className="text-xs text-white uppercase bg-blue-600 dark:text-white">
            <Table.HeadCell className="bg-zinc-300 dark:bg-zinc-600">{'Map Name'}</Table.HeadCell>
            <Table.HeadCell className="bg-zinc-300 dark:bg-zinc-600">{'Shared By'}</Table.HeadCell>
            <Table.HeadCell className="bg-zinc-300 dark:bg-zinc-600">{'Access'}</Table.HeadCell>
            <Table.HeadCell className="bg-zinc-300 dark:bg-zinc-600">{'Status'}</Table.HeadCell>
            <Table.HeadCell className="bg-zinc-300 dark:bg-zinc-600">{'Actions'}</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {
              shareDataImport.map((el: { _id: string, sharedMapName: string, ownerUserEmail: string, access: string, status: string  }) =>
                <Table.Row key={el._id} className="bg-white dark:border-gray-700 dark:bg-zinc-700">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{el.sharedMapName}</Table.Cell>
                  <Table.Cell>{el.ownerUserEmail}</Table.Cell>
                  <Table.Cell>{el.access}</Table.Cell>
                  <Table.Cell>{el.status}</Table.Cell>
                  {el.status === 'waiting' &&
                    <Table.Cell>
                      <a className="font-medium text-cyan-600 hover:underline hover:cursor-pointer dark:text-cyan-500" onClick={() => {dispatch(nodeApi.endpoints.acceptShare.initiate({shareId: el._id}))}}>
                        {'Accept'}
                      </a>
                    </Table.Cell>}
                  {el.status === 'accepted' && <Table.Cell><a>{'Accepted'}</a></Table.Cell>}
                </Table.Row>
              )
            }
          </Table.Body>
        </Table>
      </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal>
  )
}
