import fs from 'fs'
import * as XLSX from 'xlsx/xlsx.mjs'
import * as dotenv from 'dotenv'
import criarArquivo from './criarArquivo.js'

/* load 'fs' for readFile and writeFile support */
XLSX.set_fs(fs);

/* load 'stream' for stream support */
import { Readable } from 'stream';
XLSX.stream.set_readable(Readable);

/* load the codepage support library for extended support with older formats  */
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
XLSX.set_cptable(cpexcel);

dotenv.config()

const DATA_TO_COL = {
  month: 'B',
  name: 'C',
  literatures: 'D',
  videos: 'E',
  hours: 'F',
  returnVisits: 'G',
  bibleStudies: 'H',
  observations: 'I',
  auxPioneer: 'K'
}

async function execute () {
  let file = XLSX.readFileSync('tmp/reports.xlsx', { cellDates: true })
  let relatorios = XLSX.utils.sheet_to_json(file.Sheets['Relatórios'])
  let publicadores = XLSX.utils.sheet_to_json(file.Sheets['Publicadores'])

  publicadores = addReportsToPublisher(publicadores, relatorios)

  for (let publicador of Object.values(publicadores)){
    criarArquivo(publicador)
  }
}

function addReportsToPublisher(publishers, reports) {
  let pubs = {}

  for (let publisher of publishers) pubs[publisher['Publicadores']] = publisher

  for (let report of reports) {
    if (!pubs[report['Publicador']]) continue

    if (!pubs[report['Publicador']].reports) pubs[report['Publicador']].reports = {}

    let sy = determineServiceYear(report['Mês e Ano'])

    if (!pubs[report['Publicador']].reports[sy]) pubs[report['Publicador']].reports[sy] = []

    pubs[report['Publicador']].reports[sy].push(report)
  }

  for (let [publisher, data] of Object.entries(pubs)) {
    pubs[publisher].reports = addTotalsAndAverage (pubs[publisher].reports)
  }

  return pubs
}

function determineServiceYear(dateTime) {
  let date = new Date(dateTime)
  let month = date.getMonth()

  return month >= 8 ? date.getFullYear() + 1 : date.getFullYear()
}

function addTotalsAndAverage(reports) {
  if (!reports) {
    return
  }
  for (let [year, yReports] of Object.entries(reports)) {
    reports[year] = addTotalAndAverageForYear(yReports)
  }

  return reports
}

function addTotalAndAverageForYear (reports) {
  let totals = {
    'Publicações': {
      total: 0,
      count: 0,
      avg: 0
    },
    'Vídeos': {
      total: 0,
      count: 0,
      avg: 0
    },
    'Horas': {
      total: 0,
      count: 0,
      avg: 0
    },
    'Revisitas': {
      total: 0,
      count: 0,
      avg: 0
    },
    'Estudos Bíblicos': {
      total: 0,
      count: 0,
      avg: 0
    }
  }

  for (let report of reports) {
    for (let prop of Object.keys(totals)) {
      if (!report[prop]) continue

      totals[prop].total += report[prop]
      totals[prop].count += 1
    }
  }

  for (let prop of Object.keys(totals)) {
    let avg = totals[prop].total / totals[prop].count
    avg = Math.round(avg * 100) / 100

    totals[prop].avg = avg
  }

  return [...reports, totals]
}

execute()