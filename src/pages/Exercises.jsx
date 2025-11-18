import React, { useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { useLangTheme } from '../components/LanguageThemeProvider'

function EditableTable({columns, initialRows=3, title}){
  const [rows, setRows] = useState(Array.from({length: initialRows}, ()=>columns.reduce((a,c)=>({ ...a, [c.accessor]: ''}), {})))

  const addRow = ()=> setRows(r=>[...r, columns.reduce((a,c)=>({ ...a, [c.accessor]: ''}), {})])
  const update = (i,key,val)=> setRows(r=> r.map((row,idx)=> idx===i?{...row,[key]:val}:row))

  const exportCSV = ()=>{
    const header = columns.map(c=>c.header).join(',')
    const lines = rows.map(r=> columns.map(c=>JSON.stringify(r[c.accessor]||'')).join(','))
    const csv = [header, ...lines].join('\n')
    const blob = new Blob([csv], {type:'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (title||'table') + '.csv'
    a.click()
  }

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-900/40">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex gap-2">
          <button onClick={addRow} className="px-3 py-1 rounded-md border border-slate-300 dark:border-slate-700">+ Row</button>
          <button onClick={exportCSV} className="px-3 py-1 rounded-md bg-blue-600 text-white">Export CSV</button>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-900/60">
            <tr>
              {columns.map(col=> <th key={col.accessor} className="text-left px-3 py-2 font-medium">{col.header}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx)=> (
              <tr key={idx} className="border-t border-slate-200 dark:border-slate-800">
                {columns.map(col => (
                  <td key={col.accessor} className="px-3 py-2">
                    <input value={row[col.accessor]}
                      onChange={(e)=>update(idx, col.accessor, e.target.value)}
                      className="w-full px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"/>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Exercises(){
  const { t } = useLangTheme()

  const orderColumns = useMemo(()=>[
    { header: 'Time', accessor: 'time' },
    { header: 'Ticket #', accessor: 'ticket' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Order', accessor: 'order' },
    { header: 'Priority', accessor: 'priority' },
    { header: 'Notes', accessor: 'notes' },
  ], [])

  const pourColumns = useMemo(()=>[
    { header: 'Spirit', accessor: 'spirit' },
    { header: 'Target (ml)', accessor: 'target' },
    { header: 'Actual (ml)', accessor: 'actual' },
    { header: 'Delta (ml)', accessor: 'delta' },
    { header: 'Method', accessor: 'method' },
  ], [])

  return (
    <Layout>
      <div className="space-y-8">
        <EditableTable title={t('orderManagement')} columns={orderColumns} />
        <EditableTable title={t('pourManagement')} columns={pourColumns} />
      </div>
    </Layout>
  )
}
