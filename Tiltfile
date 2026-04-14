update_settings(max_parallel_updates=2, k8s_upsert_timeout_secs=600)

# Define profiles for optional components (e.g. `tilt up -- --profile n8n --profile librechat`)
config.define_string_list("profile")
cfg = config.parse()
profiles = cfg.get("profile", [])

# Load .env file for environment variables
load('ext://dotenv', 'dotenv')
dotenv()

load('ext://helm_remote', 'helm_remote')

v1alpha1.extension_repo(name='agentic-layer', url='https://github.com/agentic-layer/tilt-extensions', ref='v0.15.1')

v1alpha1.extension(name='cert-manager', repo_name='agentic-layer', repo_path='cert-manager')
load('ext://cert-manager', 'cert_manager_install')
cert_manager_install()

v1alpha1.extension(name='agent-runtime', repo_name='agentic-layer', repo_path='agent-runtime')
load('ext://agent-runtime', 'agent_runtime_install')
agent_runtime_install(version='0.26.0')

v1alpha1.extension(name='ai-gateway-litellm', repo_name='agentic-layer', repo_path='ai-gateway-litellm')
load('ext://ai-gateway-litellm', 'ai_gateway_litellm_install')
ai_gateway_litellm_install(version='0.8.2', instance=False)

v1alpha1.extension(name='agent-gateway-krakend', repo_name='agentic-layer', repo_path='agent-gateway-krakend')
load('ext://agent-gateway-krakend', 'agent_gateway_krakend_install')
agent_gateway_krakend_install(version='0.6.6', instance=False)

v1alpha1.extension(name='tool-gateway-agentgateway', repo_name='agentic-layer', repo_path='tool-gateway-agentgateway')
load('ext://tool-gateway-agentgateway', 'tool_gateway_agentgateway_install')
tool_gateway_agentgateway_install(version='0.2.3', instance=False)

# Override Agent resource to use image from spec.image field
# As a consequence, all agents have to specify the image field.
# Unfortunately, Tilt does not currently support using a default/optional image pattern with k8s_kind.
k8s_kind(
    '^Agent$',
    image_json_path='{.spec.image}',
    # Operator creates pods asynchronously after Agent CRD creation and Tilt
    # must wait for operator-managed pods rather than assuming immediate readiness
    pod_readiness='wait',
)

# Docker builds
docker_build('claims-voice-agent', context='./agents/claims-voice-agent')
docker_build('customer-database', context='./mcp-servers/customer-database')
docker_build('frontend', context='./frontend')

# Install base resources via Helm chart (local development)
# Override image repositories to use local Tilt-built images (without registry prefix)
k8s_yaml(helm(
    'chart',
    name='showcase-insurance-claims',
    namespace='showcase-insurance-claims',
    values=['chart/values.yaml'],
    set=[
        'images.voiceAgent.repository=claims-voice-agent',
        'images.customerDatabase.repository=customer-database',
        'images.frontend.repository=frontend',
        'images.agentTemplateAdk.repository=ghcr.io/agentic-layer/agent-template-adk',
        'images.agentTemplateAdk.tag=0.8.6',
        'extraEnv[0].name=OTEL_EXPORTER_OTLP_PROTOCOL',
        'extraEnv[0].value=http/protobuf',
        'extraEnv[1].name=OTEL_EXPORTER_OTLP_ENDPOINT',
        'extraEnv[1].value=http://lgtm.monitoring.svc.cluster.local:4318',
    ],
))

# Install local-only resources via Kustomize (n8n, observability, LGTM)
k8s_yaml(kustomize('deploy/local'))

# Showcase Components
k8s_resource('insurance-claims-workforce', labels=['showcase'], resource_deps=['agent-runtime'], pod_readiness='ignore')
k8s_resource('claims-analysis-agent', labels=['showcase'], resource_deps=['agent-runtime', 'customer-database'],
             port_forwards=['12011:8000'])
k8s_resource('claims-voice-agent', labels=['showcase'], resource_deps=['agent-runtime', 'customer-database'],
             port_forwards=['12010:8000'])
k8s_resource('customer-database', labels=['showcase'], resource_deps=['agent-runtime'], port_forwards=['12020:8000'])
k8s_resource('showcase-claims-frontend', labels=['showcase'], resource_deps=['claims-voice-agent'],
             port_forwards=['12030:80'])

# Agentic Layer Components
k8s_resource('ai-gateway', labels=['agentic-layer'], resource_deps=['agent-runtime'], port_forwards=['12001:4000'])
k8s_resource('agent-gateway', labels=['agentic-layer'], resource_deps=['agent-runtime'], port_forwards=['12002:8080'])
k8s_resource('tool-gateway', labels=['agentic-layer'], resource_deps=['agent-runtime'], port_forwards='12005:80')
k8s_resource('agent-runtime-configuration', labels=['agentic-layer'], resource_deps=['agent-runtime'])

# Monitoring
k8s_resource('lgtm', labels=['monitoring'], resource_deps=[], port_forwards=['12000:3000'])

# Secrets for LLM API keys
google_api_key = os.environ.get('GOOGLE_API_KEY', '')
if not google_api_key:
    warn('GOOGLE_API_KEY environment variable is not set. Please set it in your shell or .env file.')

openai_api_key = os.environ.get('OPENAI_API_KEY', '')
if not openai_api_key:
    warn('OPENAI_API_KEY environment variable is not set. Please set it in your shell or .env file.')

# Create Kubernetes secrets from environment variables
load('ext://secret', 'secret_from_dict')
k8s_yaml(secret_from_dict(
    name="api-key-secrets",
    namespace="ai-gateway",
    # The ai-gateway expects the API key to be called <provider>_API_KEY
    inputs={"GEMINI_API_KEY": google_api_key, "OPENAI_API_KEY": openai_api_key}
))

# Create secret for voice agent, which is not yet using the ai-gateway
k8s_yaml(secret_from_dict(
    name="api-key-secrets",
    namespace="showcase-insurance-claims",
    # The ai-gateway expects the API key to be called <provider>_API_KEY
    inputs={"GEMINI_API_KEY": google_api_key}
))

# Observability Dashboard
helm_remote(
    'observability-dashboard',
    repo_url='oci://ghcr.io/agentic-layer/charts',
    version='0.3.0',
    namespace='observability-dashboard',
)
k8s_resource('observability-dashboard', labels=['agentic-layer'], port_forwards='11004:8000')

# LibreChat
v1alpha1.extension(name='librechat', repo_name='agentic-layer', repo_path='librechat')
load('ext://librechat', 'librechat_install')
if 'librechat' in profiles:
    librechat_install(port='11003')

# n8n Components (Helm chart: https://artifacthub.io/packages/helm/community-charts/n8n)
if 'n8n' in profiles:
    helm_remote(
        'n8n',
        repo_url='https://community-charts.github.io/helm-charts',
        repo_name='community-charts',
        version='1.16.35',
        namespace='n8n',
        values=['deploy/local/n8n-values.yaml'],
    )
    k8s_resource('n8n', labels=['n8n'], port_forwards=['12041:5678'])
    k8s_resource('n8n-postgresql', labels=['n8n'])
