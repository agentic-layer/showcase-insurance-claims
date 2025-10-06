"""
Mock customer database for insurance claims processing.
Contains customer information used for verification and claims processing.
"""


def get_customers_db() -> dict:
    """
    Returns the mock customer database.

    Returns:
        Dictionary containing customer data keyed by normalized name.
    """
    return {
        "john doe": {
            "first_name": "John",
            "last_name": "Doe",
            "birth_date": "1990-01-01",
            "customer_id": "1fd51d23-14bc-4aee-81d0-b4845a3856c9",
            "phone": "+49-151-12345678",
            "email": "john.doe@email.de",
            "address": {
                "street": "Musterstraße 123",
                "city": "Berlin",
                "postal_code": "10115",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-001-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-01",
                    "vehicles": [{"license_plate": "B-JD-1234", "make": "BMW", "model": "3er", "year": 2020}],
                }
            ],
        },
        "anna schmidt": {
            "first_name": "Anna",
            "last_name": "Schmidt",
            "birth_date": "1990-08-22",
            "customer_id": "2ef62e34-25cd-5bff-92e1-c5956b4967da",
            "phone": "+49-151-23456789",
            "email": "anna.schmidt@email.de",
            "address": {
                "street": "Friedrichstraße 45",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-002-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-01",
                    "vehicles": [{"license_plate": "B-AS-5678", "make": "Audi", "model": "A4", "year": 2021}],
                }
            ],
        },
        "thomas fischer": {
            "first_name": "Thomas",
            "last_name": "Fischer",
            "birth_date": "1982-11-30",
            "customer_id": "3fg73f45-36de-6c00-a3f2-d6a67c5a78eb",
            "phone": "+49-151-34567890",
            "email": "thomas.fischer@email.de",
            "address": {
                "street": "Unter den Linden 77",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-003-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-15",
                    "vehicles": [{"license_plate": "B-TF-9012", "make": "Mercedes", "model": "C-Klasse", "year": 2019}],
                }
            ],
        },
        "julia weber": {
            "first_name": "Julia",
            "last_name": "Weber",
            "birth_date": "1992-03-14",
            "customer_id": "4gh84g56-47ef-7d11-b4g3-e7b78d6b89fc",
            "phone": "+49-151-45678901",
            "email": "julia.weber@email.de",
            "address": {
                "street": "Kurfürstendamm 210",
                "city": "Berlin",
                "postal_code": "10719",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-004-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-01",
                    "vehicles": [{"license_plate": "B-JW-3456", "make": "VW", "model": "Golf", "year": 2022}],
                }
            ],
        },
        "michael meyer": {
            "first_name": "Michael",
            "last_name": "Meyer",
            "birth_date": "1978-07-08",
            "customer_id": "5hi95h67-58f0-8e22-c5h4-f8c89e7c9a0d",
            "phone": "+49-151-56789012",
            "email": "michael.meyer@email.de",
            "address": {
                "street": "Alexanderplatz 1",
                "city": "Berlin",
                "postal_code": "10178",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-005-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-20",
                    "vehicles": [{"license_plate": "B-MM-7890", "make": "BMW", "model": "5er", "year": 2021}],
                }
            ],
        },
        "sarah wagner": {
            "first_name": "Sarah",
            "last_name": "Wagner",
            "birth_date": "1988-09-25",
            "customer_id": "6ij06i78-69g1-9f33-d6i5-g9d90f8d0b1e",
            "phone": "+49-151-67890123",
            "email": "sarah.wagner@email.de",
            "address": {
                "street": "Potsdamer Platz 5",
                "city": "Berlin",
                "postal_code": "10785",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-006-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-15",
                    "vehicles": [{"license_plate": "B-SW-1234", "make": "Audi", "model": "Q5", "year": 2020}],
                }
            ],
        },
        "andreas becker": {
            "first_name": "Andreas",
            "last_name": "Becker",
            "birth_date": "1975-12-03",
            "customer_id": "7jk17j89-7ah2-ag44-e7j6-hae01g9e1c2f",
            "phone": "+49-151-78901234",
            "email": "andreas.becker@email.de",
            "address": {
                "street": "Leipziger Straße 16",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-007-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-10",
                    "vehicles": [{"license_plate": "B-AB-5678", "make": "Mercedes", "model": "E-Klasse", "year": 2018}],
                }
            ],
        },
        "laura schulz": {
            "first_name": "Laura",
            "last_name": "Schulz",
            "birth_date": "1995-04-19",
            "customer_id": "8kl28k90-8bi3-bh55-f8k7-ibf12h0f2d3g",
            "phone": "+49-151-89012345",
            "email": "laura.schulz@email.de",
            "address": {
                "street": "Tauentzienstraße 21-24",
                "city": "Berlin",
                "postal_code": "10789",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-008-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-10",
                    "vehicles": [{"license_plate": "B-LS-9012", "make": "VW", "model": "Polo", "year": 2023}],
                }
            ],
        },
        "christian hoffmann": {
            "first_name": "Christian",
            "last_name": "Hoffmann",
            "birth_date": "1980-10-07",
            "customer_id": "9lm39l01-9cj4-ci66-g9l8-jcg23i1g3e4h",
            "phone": "+49-151-90123456",
            "email": "christian.hoffmann@email.de",
            "address": {
                "street": "Wilhelmstraße 92",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-009-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-20",
                    "vehicles": [{"license_plate": "B-CH-3456", "make": "BMW", "model": "X3", "year": 2021}],
                }
            ],
        },
        "melanie schäfer": {
            "first_name": "Melanie",
            "last_name": "Schäfer",
            "birth_date": "1993-06-12",
            "customer_id": "0mn40m12-0dk5-dj77-h0m9-kdh34j2h4f5i",
            "phone": "+49-151-01234567",
            "email": "melanie.schaefer@email.de",
            "address": {"street": "Schlossplatz 1", "city": "Berlin", "postal_code": "10178", "country": "Deutschland"},
            "policies": [
                {
                    "policy_id": "KFZ-010-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-25",
                    "vehicles": [{"license_plate": "B-MS-7890", "make": "Audi", "model": "A3", "year": 2022}],
                }
            ],
        },
        "stefan koch": {
            "first_name": "Stefan",
            "last_name": "Koch",
            "birth_date": "1987-02-28",
            "customer_id": "1no51n23-1el6-ek88-i1n0-lei45k3i5g6j",
            "phone": "+49-151-12345670",
            "email": "stefan.koch@email.de",
            "address": {
                "street": "Gärtnerstraße 15",
                "city": "Berlin",
                "postal_code": "10245",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-011-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-05",
                    "vehicles": [{"license_plate": "B-SK-1234", "make": "Mercedes", "model": "A-Klasse", "year": 2020}],
                }
            ],
        },
        "nadine bauer": {
            "first_name": "Nadine",
            "last_name": "Bauer",
            "birth_date": "1991-07-17",
            "customer_id": "2op62o34-2fm7-fl99-j2o1-mfj56l4j6h7k",
            "phone": "+49-151-23456781",
            "email": "nadine.bauer@email.de",
            "address": {
                "street": "Warschauer Straße 70",
                "city": "Berlin",
                "postal_code": "10243",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-012-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-10",
                    "vehicles": [{"license_plate": "B-NB-5678", "make": "VW", "model": "Tiguan", "year": 2021}],
                }
            ],
        },
        "marco richter": {
            "first_name": "Marco",
            "last_name": "Richter",
            "birth_date": "1983-11-23",
            "customer_id": "3pq73p45-3gn8-gm00-k3p2-ngk67m5k7i8l",
            "phone": "+49-151-34567892",
            "email": "marco.richter@email.de",
            "address": {
                "street": "Oranienburger Straße 28",
                "city": "Berlin",
                "postal_code": "10178",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-013-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-30",
                    "vehicles": [{"license_plate": "B-MR-9012", "make": "BMW", "model": "1er", "year": 2019}],
                }
            ],
        },
        "vanessa klein": {
            "first_name": "Vanessa",
            "last_name": "Klein",
            "birth_date": "1994-05-30",
            "customer_id": "4qr84q56-4ho9-hn11-l4q3-ohl78n6l8j9m",
            "phone": "+49-151-45678903",
            "email": "vanessa.klein@email.de",
            "address": {"street": "Torstraße 1", "city": "Berlin", "postal_code": "10119", "country": "Deutschland"},
            "policies": [
                {
                    "policy_id": "KFZ-014-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-15",
                    "vehicles": [{"license_plate": "B-VK-3456", "make": "Audi", "model": "TT", "year": 2022}],
                }
            ],
        },
        "dennis wolf": {
            "first_name": "Dennis",
            "last_name": "Wolf",
            "birth_date": "1981-09-14",
            "customer_id": "5rs95r67-5ip0-io22-m5r4-pim89o7m9k0n",
            "phone": "+49-151-56789014",
            "email": "dennis.wolf@email.de",
            "address": {
                "street": "Karl-Marx-Allee 78",
                "city": "Berlin",
                "postal_code": "10243",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-015-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-25",
                    "vehicles": [{"license_plate": "B-DW-7890", "make": "Mercedes", "model": "GLA", "year": 2020}],
                }
            ],
        },
        "katharina neumann": {
            "first_name": "Katharina",
            "last_name": "Neumann",
            "birth_date": "1989-12-05",
            "customer_id": "6st06s78-6jq1-jp33-n6s5-qjn90p8n0l1o",
            "phone": "+49-151-67890125",
            "email": "katharina.neumann@email.de",
            "address": {"street": "Sonnenallee 65", "city": "Berlin", "postal_code": "12045", "country": "Deutschland"},
            "policies": [
                {
                    "policy_id": "KFZ-016-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-05",
                    "vehicles": [{"license_plate": "B-KN-1234", "make": "VW", "model": "Passat", "year": 2021}],
                }
            ],
        },
        "alexander schwarz": {
            "first_name": "Alexander",
            "last_name": "Schwarz",
            "birth_date": "1979-04-18",
            "customer_id": "7tu17t89-7kr2-kq44-o7t6-rko01q9o1m2p",
            "phone": "+49-151-78901236",
            "email": "alexander.schwarz@email.de",
            "address": {"street": "Kantstraße 30", "city": "Berlin", "postal_code": "10623", "country": "Deutschland"},
            "policies": [
                {
                    "policy_id": "KFZ-017-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-28",
                    "vehicles": [{"license_plate": "B-AS-5678", "make": "BMW", "model": "7er", "year": 2019}],
                }
            ],
        },
        "jessica zimmermann": {
            "first_name": "Jessica",
            "last_name": "Zimmermann",
            "birth_date": "1996-08-22",
            "customer_id": "8uv28u90-8ls3-lr55-p8u7-slp12r0p2n3q",
            "phone": "+49-151-89012347",
            "email": "jessica.zimmermann@email.de",
            "address": {
                "street": "Kurfürstendamm 26",
                "city": "Berlin",
                "postal_code": "10719",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-018-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-20",
                    "vehicles": [{"license_plate": "B-JZ-9012", "make": "Audi", "model": "Q3", "year": 2023}],
                }
            ],
        },
        "patrick braun": {
            "first_name": "Patrick",
            "last_name": "Braun",
            "birth_date": "1984-01-09",
            "customer_id": "9vw39v01-9mt4-ms66-q9v8-tmq23s1q3o4r",
            "phone": "+49-151-90123458",
            "email": "patrick.braun@email.de",
            "address": {"street": "Mehringdamm 20", "city": "Berlin", "postal_code": "10961", "country": "Deutschland"},
            "policies": [
                {
                    "policy_id": "KFZ-019-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-12",
                    "vehicles": [{"license_plate": "B-PB-3456", "make": "Mercedes", "model": "C-Klasse", "year": 2020}],
                }
            ],
        },
        "sabine krüger": {
            "first_name": "Sabine",
            "last_name": "Krüger",
            "birth_date": "1990-10-31",
            "customer_id": "0wx40w12-0nu5-nt77-r0w9-unr34t2r4p5s",
            "phone": "+49-151-01234569",
            "email": "sabine.krueger@email.de",
            "address": {
                "street": "Bergmannstraße 2",
                "city": "Berlin",
                "postal_code": "10961",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-020-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-25",
                    "vehicles": [{"license_plate": "B-SK-7890", "make": "VW", "model": "Golf GTI", "year": 2022}],
                }
            ],
        },
        "tobias hofmann": {
            "first_name": "Tobias",
            "last_name": "Hofmann",
            "birth_date": "1986-03-25",
            "customer_id": "1xy51x23-1ov6-ou88-s1x0-vos45u3s5q6t",
            "phone": "+49-151-12345671",
            "email": "tobias.hofmann@email.de",
            "address": {
                "street": "Schönhauser Allee 120",
                "city": "Berlin",
                "postal_code": "10439",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-021-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-05",
                    "vehicles": [{"license_plate": "B-TH-1234", "make": "BMW", "model": "Z4", "year": 2021}],
                }
            ],
        },
        "lena lange": {
            "first_name": "Lena",
            "last_name": "Lange",
            "birth_date": "1993-07-12",
            "customer_id": "2yz62y34-2pw7-pv99-t2y1-wpt56v4t6r7u",
            "phone": "+49-151-23456782",
            "email": "lena.lange@email.de",
            "address": {
                "street": "Prenzlauer Allee 48",
                "city": "Berlin",
                "postal_code": "10405",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-022-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-18",
                    "vehicles": [{"license_plate": "B-LL-5678", "make": "Audi", "model": "A1", "year": 2020}],
                }
            ],
        },
        "jan schuster": {
            "first_name": "Jan",
            "last_name": "Schuster",
            "birth_date": "1980-12-15",
            "customer_id": "3za73z45-3qx8-qw00-u3z2-xqu67w5u7s8v",
            "phone": "+49-151-34567893",
            "email": "jan.schuster@email.de",
            "address": {
                "street": "Greifswalder Straße 55",
                "city": "Berlin",
                "postal_code": "10405",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-023-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-08",
                    "vehicles": [{"license_plate": "B-JS-9012", "make": "Mercedes", "model": "GLC", "year": 2019}],
                }
            ],
        },
        "nina krause": {
            "first_name": "Nina",
            "last_name": "Krause",
            "birth_date": "1995-05-28",
            "customer_id": "4ab84a56-4ry9-rx11-v4a3-yrv78x6v8t9w",
            "phone": "+49-151-45678904",
            "email": "nina.krause@email.de",
            "address": {
                "street": "Danziger Straße 50",
                "city": "Berlin",
                "postal_code": "10435",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-024-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-12",
                    "vehicles": [{"license_plate": "B-NK-3456", "make": "VW", "model": "Up!", "year": 2022}],
                }
            ],
        },
        "sebastian meier": {
            "first_name": "Sebastian",
            "last_name": "Meier",
            "birth_date": "1978-09-03",
            "customer_id": "5bc95b67-5sz0-sy22-w5b4-zsw89y7w9u0x",
            "phone": "+49-151-56789015",
            "email": "sebastian.meier@email.de",
            "address": {
                "street": "Kastanienallee 86",
                "city": "Berlin",
                "postal_code": "10435",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-025-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-22",
                    "vehicles": [{"license_plate": "B-SM-7890", "make": "BMW", "model": "X5", "year": 2020}],
                }
            ],
        },
        "melissa lehmann": {
            "first_name": "Melissa",
            "last_name": "Lehmann",
            "birth_date": "1992-02-17",
            "customer_id": "6cd06c78-6ta1-tz33-x6c5-atx90z8x0v1y",
            "phone": "+49-151-67890126",
            "email": "melissa.lehmann@email.de",
            "address": {
                "street": "Bernauer Straße 63",
                "city": "Berlin",
                "postal_code": "13355",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-026-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-12",
                    "vehicles": [{"license_plate": "B-ML-1234", "make": "Audi", "model": "Q7", "year": 2021}],
                }
            ],
        },
        "florian schmitt": {
            "first_name": "Florian",
            "last_name": "Schmitt",
            "birth_date": "1983-11-08",
            "customer_id": "7de17d89-7ub2-ua44-y7d6-buy01a9y1w2z",
            "phone": "+49-151-78901237",
            "email": "florian.schmitt@email.de",
            "address": {
                "street": "Brunnenstraße 9",
                "city": "Berlin",
                "postal_code": "10119",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-027-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-18",
                    "vehicles": [{"license_plate": "B-FS-5678", "make": "Mercedes", "model": "S-Klasse", "year": 2019}],
                }
            ],
        },
        "carolin böhm": {
            "first_name": "Carolin",
            "last_name": "Böhm",
            "birth_date": "1988-06-21",
            "customer_id": "8ef28e90-8vc3-vb55-z8e7-cvz12b0z2x3a",
            "phone": "+49-151-89012348",
            "email": "carolin.boehm@email.de",
            "address": {
                "street": "Chausseestraße 8",
                "city": "Berlin",
                "postal_code": "10115",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-028-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-28",
                    "vehicles": [{"license_plate": "B-CB-9012", "make": "VW", "model": "Arteon", "year": 2022}],
                }
            ],
        },
        "daniel simon": {
            "first_name": "Daniel",
            "last_name": "Simon",
            "birth_date": "1977-10-14",
            "customer_id": "9fg39f01-9wd4-wc66-a9f8-dwc23c1a3y4b",
            "phone": "+49-151-90123459",
            "email": "daniel.simon@email.de",
            "address": {
                "street": "Invalidenstraße 130",
                "city": "Berlin",
                "postal_code": "10115",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-029-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-18",
                    "vehicles": [{"license_plate": "B-DS-3456", "make": "BMW", "model": "i3", "year": 2021}],
                }
            ],
        },
        "sophie winter": {
            "first_name": "Sophie",
            "last_name": "Winter",
            "birth_date": "1994-04-07",
            "customer_id": "0gh40g12-0xe5-xd77-b0g9-exa34d2b4z5c",
            "phone": "+49-151-01234560",
            "email": "sophie.winter@email.de",
            "address": {"street": "Ackerstraße 23", "city": "Berlin", "postal_code": "10115", "country": "Deutschland"},
            "policies": [
                {
                    "policy_id": "KFZ-030-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-22",
                    "vehicles": [{"license_plate": "B-SW-7890", "make": "Audi", "model": "e-tron", "year": 2023}],
                }
            ],
        },
        "kevin vogel": {
            "first_name": "Kevin",
            "last_name": "Vogel",
            "birth_date": "1981-08-19",
            "customer_id": "1hi51h23-1yf6-ye88-c1h0-fyf45e3c5a6d",
            "phone": "+49-151-12345672",
            "email": "kevin.vogel@email.de",
            "address": {
                "street": "Zimmerstraße 88",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-031-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-15",
                    "vehicles": [{"license_plate": "B-KV-1234", "make": "Mercedes", "model": "EQC", "year": 2020}],
                }
            ],
        },
        "julia engel": {
            "first_name": "Julia",
            "last_name": "Engel",
            "birth_date": "1990-01-24",
            "customer_id": "2ij62i34-2zg7-zf99-d2i1-gzg56f4d6b7e",
            "phone": "+49-151-23456783",
            "email": "julia.engel@email.de",
            "address": {
                "street": "Markgrafenstraße 12",
                "city": "Berlin",
                "postal_code": "10969",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-032-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-22",
                    "vehicles": [{"license_plate": "B-JE-5678", "make": "VW", "model": "ID.3", "year": 2022}],
                }
            ],
        },
        "philipp brandt": {
            "first_name": "Philipp",
            "last_name": "Brandt",
            "birth_date": "1985-07-13",
            "customer_id": "3jk73j45-3ah8-ag00-e3j2-hah67g5e7c8f",
            "phone": "+49-151-34567894",
            "email": "philipp.brandt@email.de",
            "address": {
                "street": "Rudi-Dutschke-Straße 26",
                "city": "Berlin",
                "postal_code": "10969",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-033-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-08",
                    "vehicles": [{"license_plate": "B-PB-9012", "make": "BMW", "model": "iX", "year": 2021}],
                }
            ],
        },
        "natalie sauer": {
            "first_name": "Natalie",
            "last_name": "Sauer",
            "birth_date": "1993-11-30",
            "customer_id": "4kl84k56-4bi9-bh11-f4k3-ibi78h6f8d9g",
            "phone": "+49-151-45678905",
            "email": "natalie.sauer@email.de",
            "address": {
                "street": "Friedrichstraße 200",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-034-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-08",
                    "vehicles": [{"license_plate": "B-NS-3456", "make": "Audi", "model": "Q4 e-tron", "year": 2023}],
                }
            ],
        },
        "marc graf": {
            "first_name": "Marc",
            "last_name": "Graf",
            "birth_date": "1979-05-22",
            "customer_id": "5lm95l67-5cj0-ci22-g5l4-jci89i7g9e0h",
            "phone": "+49-151-56789016",
            "email": "marc.graf@email.de",
            "address": {
                "street": "Köpenicker Straße 76",
                "city": "Berlin",
                "postal_code": "10179",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-035-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-28",
                    "vehicles": [{"license_plate": "B-MG-7890", "make": "Mercedes", "model": "EQS", "year": 2022}],
                }
            ],
        },
        "laura jung": {
            "first_name": "Laura",
            "last_name": "Jung",
            "birth_date": "1996-09-15",
            "customer_id": "6mn06m78-6dk1-dj33-h6m5-kdk90j8h0f1i",
            "phone": "+49-151-67890127",
            "email": "laura.jung@email.de",
            "address": {
                "street": "Alte Jakobstraße 2",
                "city": "Berlin",
                "postal_code": "10179",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-036-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-14",
                    "vehicles": [{"license_plate": "B-LJ-1234", "make": "VW", "model": "ID.4", "year": 2023}],
                }
            ],
        },
        "timo hahn": {
            "first_name": "Timo",
            "last_name": "Hahn",
            "birth_date": "1984-03-08",
            "customer_id": "7no17n89-7el2-ek44-i7n6-lek01k9i1g2j",
            "phone": "+49-151-78901238",
            "email": "timo.hahn@email.de",
            "address": {
                "street": "Wilhelmstraße 44",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-037-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-25",
                    "vehicles": [{"license_plate": "B-TH-5678", "make": "BMW", "model": "i4", "year": 2022}],
                }
            ],
        },
        "franziska ziegler": {
            "first_name": "Franziska",
            "last_name": "Ziegler",
            "birth_date": "1991-12-11",
            "customer_id": "8op28o90-8fm3-fl55-j8o7-mfl12l0j2h3k",
            "phone": "+49-151-89012349",
            "email": "franziska.ziegler@email.de",
            "address": {
                "street": "Behrenstraße 42",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-038-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-05",
                    "vehicles": [{"license_plate": "B-FZ-9012", "make": "Audi", "model": "A6 e-tron", "year": 2024}],
                }
            ],
        },
        "sven kühn": {
            "first_name": "Sven",
            "last_name": "Kühn",
            "birth_date": "1976-06-27",
            "customer_id": "9pq39p01-9gn4-gm66-k9p8-ngn23m1k3i4l",
            "phone": "+49-151-90123450",
            "email": "sven.kuehn@email.de",
            "address": {
                "street": "Mohrenstraße 30",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-039-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-20",
                    "vehicles": [{"license_plate": "B-SK-3456", "make": "Mercedes", "model": "EQE", "year": 2023}],
                }
            ],
        },
        "lara frank": {
            "first_name": "Lara",
            "last_name": "Frank",
            "birth_date": "1994-02-14",
            "customer_id": "0qr40q12-0ho5-hn77-l0q9-ohn34n2l4j5m",
            "phone": "+49-151-01234561",
            "email": "lara.frank@email.de",
            "address": {"street": "Glinkastraße 5", "city": "Berlin", "postal_code": "10117", "country": "Deutschland"},
            "policies": [
                {
                    "policy_id": "KFZ-040-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-12",
                    "vehicles": [{"license_plate": "B-LF-7890", "make": "VW", "model": "ID.5", "year": 2024}],
                }
            ],
        },
        "marcel berger": {
            "first_name": "Marcel",
            "last_name": "Berger",
            "birth_date": "1982-10-09",
            "customer_id": "1rs51r23-1ip6-io88-m1r0-pip45o4m5k6n",
            "phone": "+49-151-12345673",
            "email": "marcel.berger@email.de",
            "address": {
                "street": "Leipziger Platz 12",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-041-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-15",
                    "vehicles": [{"license_plate": "B-MB-1234", "make": "BMW", "model": "iX3", "year": 2021}],
                }
            ],
        },
        "vanessa roth": {
            "first_name": "Vanessa",
            "last_name": "Roth",
            "birth_date": "1995-07-23",
            "customer_id": "2st62s34-2jq7-jp99-n2s1-qjq56p5n6l7o",
            "phone": "+49-151-23456784",
            "email": "vanessa.roth@email.de",
            "address": {"street": "Mauerstraße 10", "city": "Berlin", "postal_code": "10117", "country": "Deutschland"},
            "policies": [
                {
                    "policy_id": "KFZ-042-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-28",
                    "vehicles": [{"license_plate": "B-VR-5678", "make": "Audi", "model": "Q8 e-tron", "year": 2023}],
                }
            ],
        },
        "dominik lange": {
            "first_name": "Dominik",
            "last_name": "Lange",
            "birth_date": "1988-04-16",
            "customer_id": "3tu73t45-3kr8-kq00-o3t2-rkr67q6o7m8p",
            "phone": "+49-151-34567895",
            "email": "dominik.lange@email.de",
            "address": {
                "street": "Kronenstraße 72",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-043-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-20",
                    "vehicles": [{"license_plate": "B-DL-9012", "make": "Mercedes", "model": "EQB", "year": 2022}],
                }
            ],
        },
        "lea meyer": {
            "first_name": "Lea",
            "last_name": "Meyer",
            "birth_date": "1993-01-28",
            "customer_id": "4uv84u56-4ls9-lr11-p4u3-sls78r7p8n9q",
            "phone": "+49-151-45678906",
            "email": "lea.meyer@email.de",
            "address": {
                "street": "Charlottenstraße 4",
                "city": "Berlin",
                "postal_code": "10969",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-044-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-10",
                    "vehicles": [{"license_plate": "B-LM-3456", "make": "VW", "model": "ID.6", "year": 2024}],
                }
            ],
        },
        "max müller": {
            "first_name": "Max",
            "last_name": "Müller",
            "birth_date": "1985-05-15",
            "customer_id": "5vw95v67-5mt0-ms22-q5v4-tmt89s8q9o0r",
            "phone": "+49-151-56789017",
            "email": "max.mueller@email.de",
            "address": {"street": "Hauptstraße 10", "city": "Berlin", "postal_code": "10115", "country": "Deutschland"},
            "policies": [
                {
                    "policy_id": "KFZ-045-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-05",
                    "vehicles": [{"license_plate": "B-MM-7890", "make": "BMW", "model": "i7", "year": 2023}],
                }
            ],
        },
        "johanna peters": {
            "first_name": "Johanna",
            "last_name": "Peters",
            "birth_date": "1987-11-05",
            "customer_id": "6wx06w78-6nu1-nt33-r6w5-unu90t9r0p1s",
            "phone": "+49-151-67890128",
            "email": "johanna.peters@email.de",
            "address": {
                "street": "Rudi-Dutschke-Straße 23",
                "city": "Berlin",
                "postal_code": "10969",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-046-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-18",
                    "vehicles": [{"license_plate": "B-JP-1234", "make": "Audi", "model": "A7 e-tron", "year": 2024}],
                }
            ],
        },
        "felix möller": {
            "first_name": "Felix",
            "last_name": "Möller",
            "birth_date": "1992-06-18",
            "customer_id": "7xy17x89-7ov2-ou44-s7x6-vou01u0s1q2t",
            "phone": "+49-151-78901239",
            "email": "felix.moeller@email.de",
            "address": {
                "street": "Zimmerstraße 11",
                "city": "Berlin",
                "postal_code": "10969",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-047-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-25",
                    "vehicles": [{"license_plate": "B-FM-5678", "make": "Mercedes", "model": "EQA", "year": 2022}],
                }
            ],
        },
        "annika weiß": {
            "first_name": "Annika",
            "last_name": "Weiß",
            "birth_date": "1985-09-22",
            "customer_id": "8yz28y90-8pw3-pv55-t8y7-wpv12v1t2r3u",
            "phone": "+49-151-89012340",
            "email": "annika.weiss@email.de",
            "address": {
                "street": "Friedrichstraße 100",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-048-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-12",
                    "vehicles": [{"license_plate": "B-AW-9012", "make": "VW", "model": "ID.Buzz", "year": 2023}],
                }
            ],
        },
        "tobias schulze": {
            "first_name": "Tobias",
            "last_name": "Schulze",
            "birth_date": "1990-03-07",
            "customer_id": "9za39z01-9qx4-qw66-u9z8-xqx23w2u3s4v",
            "phone": "+49-151-90123461",
            "email": "tobias.schulze@email.de",
            "address": {
                "street": "Unter den Linden 17",
                "city": "Berlin",
                "postal_code": "10117",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-049-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-01-30",
                    "vehicles": [{"license_plate": "B-TS-3456", "make": "BMW", "model": "iX1", "year": 2023}],
                }
            ],
        },
        "melanie könig": {
            "first_name": "Melanie",
            "last_name": "König",
            "birth_date": "1983-12-14",
            "customer_id": "0ab40a12-0ry5-rx77-v0a9-yry34x3v4t5w",
            "phone": "+49-151-01234562",
            "email": "melanie.koenig@email.de",
            "address": {
                "street": "Potsdamer Platz 8",
                "city": "Berlin",
                "postal_code": "10785",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-050-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-03-20",
                    "vehicles": [{"license_plate": "B-MK-7890", "make": "Audi", "model": "RS e-tron GT", "year": 2024}],
                }
            ],
        },
        "benjamin walter": {
            "first_name": "Benjamin",
            "last_name": "Walter",
            "birth_date": "1980-08-11",
            "customer_id": "1bc51b23-1sz6-sy88-w1b0-zsz45y4w5u6x",
            "phone": "+49-151-12345674",
            "email": "benjamin.walter@email.de",
            "address": {
                "street": "Markgrafenstraße 14",
                "city": "Berlin",
                "postal_code": "10969",
                "country": "Deutschland",
            },
            "policies": [
                {
                    "policy_id": "KFZ-051-2024",
                    "type": "Kfz-Versicherung",
                    "status": "active",
                    "start_date": "2024-02-25",
                    "vehicles": [{"license_plate": "B-BW-1234", "make": "Mercedes", "model": "AMG EQS", "year": 2023}],
                }
            ],
        },
    }


def find_customer_by_name(name: str) -> dict:
    """
    Find a customer by name (case insensitive).

    Args:
        name: Customer name to search for

    Returns:
        Dictionary with status and customer data if found, or error if not found.
    """
    customers_db = get_customers_db()
    customer_key = name.lower().strip()

    if customer_key in customers_db:
        return {"status": "success", "customer": customers_db[customer_key]}
    else:
        return {"status": "not_found", "message": "Customer not found in database. Please verify the name spelling."}
