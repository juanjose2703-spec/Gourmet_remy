from flask import Flask, jsonify, request
from flask_restful import Resource, Api
import mysql.connector
import requests

mi_db = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    password="root",
    database="remy"
)
mi_cursor = mi_db.cursor()