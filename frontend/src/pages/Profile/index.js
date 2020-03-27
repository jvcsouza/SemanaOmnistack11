import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import "./style.css";
import logoImg from "../../assets/logo.svg";
import { FiPower, FiTrash2 } from "react-icons/fi";
import api from "../../services/api";

export default function Profile() {
  const ongName = localStorage.getItem("ongName");
  const ongId = localStorage.getItem("ongId");

  const history = useHistory();

  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    api
      .get("profile", {
        headers: {
          authorization: ongId
        }
      })
      .then(resp => setIncidents(resp.data));
  }, [ongId]);

  async function handleDeleteIncident(id) {
    try {
      await api.delete(`incidents/${id}`, {
        headers: {
          authorization: ongId
        }
      });
      setIncidents(incidents.filter(i => i.id !== id));
    } catch (err) {}
  }

  async function handleLogOut() {
    localStorage.clear();
    history.push("/");
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Bem vindo(a), {ongName}</span>
        <Link className="button" to="/incident/new">
          Cadastrar novo caso
        </Link>
        <button onClick={handleLogOut} type="button">
          <FiPower size={18} color="#E02041" />
        </button>
      </header>

      <h1>Casos cadastrados</h1>

      <ul>
        {incidents.map(inc => (
          <li key={inc.id}>
            <strong>Caso: </strong>
            <p>{inc.title}</p>

            <strong>Descrição:</strong>
            <p>{inc.desc}</p>

            <strong>Valor: </strong>
            <p>
              {Intl.NumberFormat("pt-br", {
                style: "currency",
                currency: "BRL"
              }).format(inc.value)}
            </p>

            <button onClick={e => handleDeleteIncident(inc.id)}>
              <FiTrash2 size={20} color="#a8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
