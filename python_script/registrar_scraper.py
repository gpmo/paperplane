from penn import Registrar
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

# ---------- Mongo Init/Methods ---------------------

def cleanTime(time):
    format = '%I:%M %p'
    clean_time = datetime.strptime(time, format)
    hour = clean_time.hour
    min = clean_time.minute
    mins = hour * 60 + min
    return mins

client = MongoClient('mongodb://test:test@ds117899.mlab.com:17899/heroku_npp0n9k5')
db = client.heroku_npp0n9k5

classes = db.classes

# ---------------------------------------------------

REG_USERNAME = 'UPENN_OD_enbs_1003364'
REG_PASSWORD = 'b6a18d8dme335m0a2mr2m6hvfn'

r = Registrar(REG_USERNAME, REG_PASSWORD)

course_ids = [
    'CIS110001',
    'CIS120001',
    'CIS121001',
    'CIS160001',
    'CIS240001',
    'CIS320001',
    'CIS331001',
    'CIS350001',
    'CIS371001',
    'CIS401001',
    'CIS450401',
    'CIS455401'
]

for course_id in course_ids:
    params = {
        'course_id': course_id
    }

    gen = r.search(params)
    course = gen.next()

    # instructors
    instructors = [instructor['name'] for instructor in course['instructors']]
    # meetings
    meeting = course['meetings'][0]
    start_time = meeting['start_time']
    end_time = meeting['end_time']
    # MTWRF format
    meeting_days = meeting['meeting_days']

    # put into mongo db
    result = classes.insert_one(
        {
            "start_time": cleanTime(start_time),
            "end_time": cleanTime(end_time),
            'course_id': course_id,
            'instructors': instructors,
            'meeting_days': meeting_days
            })
